#!/usr/bin/env node
/**
 * Lightweight migration runner for production.
 *
 * Applies Prisma-generated SQL migration files in lexicographic order
 * against the SQLite database pointed to by DATABASE_URL (file:...).
 *
 * Tracks applied migrations in a `_migrations` table so the same
 * migration is never applied twice, even across deploys.
 *
 * We intentionally don't ship the Prisma CLI into the production image
 * (it has heavy transitive dependencies that aren't part of the Next.js
 * standalone output). This script uses @libsql/client which we already
 * depend on via the Prisma adapter.
 */

import { createClient } from "@libsql/client";
import { readdirSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, "..", "prisma", "migrations");

const dbUrl = process.env.DATABASE_URL || "file:./prisma/prod.db";
if (!dbUrl.startsWith("file:")) {
  console.error("DATABASE_URL must be a file:... URL for SQLite");
  process.exit(1);
}

// Ensure the parent directory exists (for first-boot on a fresh volume)
const dbPath = dbUrl.replace(/^file:/, "");
const dbDir = dirname(dbPath);
if (dbDir && !existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

const client = createClient({ url: dbUrl });

async function run() {
  // Create tracking table if it doesn't exist
  await client.execute(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const applied = new Set(
    (await client.execute("SELECT name FROM _migrations")).rows.map((r) => r.name)
  );

  if (!existsSync(MIGRATIONS_DIR)) {
    console.log("No migrations directory found, skipping.");
    return;
  }

  const dirs = readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  let appliedCount = 0;
  for (const dir of dirs) {
    if (applied.has(dir)) continue;

    const sqlPath = join(MIGRATIONS_DIR, dir, "migration.sql");
    if (!existsSync(sqlPath)) continue;

    const rawSql = readFileSync(sqlPath, "utf8");
    // Strip SQL line comments (-- ...) but preserve the actual DDL.
    // Then split on semicolons. Prisma-generated migrations use simple DDL
    // so splitting on `;\n` (optional whitespace) is safe.
    const sql = rawSql
      .split("\n")
      .map((line) => {
        const idx = line.indexOf("--");
        return idx === -1 ? line : line.slice(0, idx);
      })
      .join("\n");

    const statements = sql
      .split(/;\s*(?:\n|$)/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    console.log(`→ Applying migration ${dir} (${statements.length} statements)`);
    for (const stmt of statements) {
      try {
        await client.execute(stmt);
      } catch (err) {
        console.error(`  ✗ Failed statement: ${stmt.slice(0, 80)}...`);
        throw err;
      }
    }

    await client.execute({
      sql: "INSERT INTO _migrations (name) VALUES (?)",
      args: [dir],
    });
    appliedCount++;
  }

  if (appliedCount === 0) {
    console.log("→ Database is up to date, no migrations to apply.");
  } else {
    console.log(`→ Applied ${appliedCount} migration(s).`);
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
