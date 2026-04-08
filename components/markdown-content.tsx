function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("### ")) {
      const text = line.slice(4);
      elements.push(
        <h3 key={i} id={slugify(text.replace(/\*\*/g, ""))}>
          <span dangerouslySetInnerHTML={{ __html: formatInline(text) }} />
        </h3>
      );
    } else if (line.startsWith("## ")) {
      const text = line.slice(3);
      elements.push(
        <h2 key={i} id={slugify(text.replace(/\*\*/g, ""))}>
          <span dangerouslySetInnerHTML={{ __html: formatInline(text) }} />
        </h2>
      );
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`}>
          {items.map((item, idx) => (
            <li key={idx}>
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    } else if (line.startsWith("| ")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      if (tableLines.length >= 2) {
        const headers = tableLines[0].split("|").filter(Boolean).map((h) => h.trim());
        const rows = tableLines.slice(2).map((row) =>
          row.split("|").filter(Boolean).map((c) => c.trim())
        );
        elements.push(
          <table key={`tbl-${i}`}>
            <thead>
              <tr>
                {headers.map((h, idx) => (
                  <th key={idx}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
      continue;
    } else if (line.trim() === "") {
      // skip
    } else {
      elements.push(
        <p key={i}>
          <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
        </p>
      );
    }

    i++;
  }

  return <>{elements}</>;
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}
