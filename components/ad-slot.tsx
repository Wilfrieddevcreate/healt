"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle";
  className?: string;
}

export function AdSlot({ slot, format = "auto", className = "" }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle;
      if (adsbygoogle) {
        adsbygoogle.push({});
        pushed.current = true;
      }
    } catch { /* AdSense not loaded */ }
  }, []);

  const adClient = process.env.NEXT_PUBLIC_ADSENSE_ID;

  if (!adClient) {
    return (
      <div className={`bg-surface dark:bg-gray-800 border border-dashed border-border dark:border-gray-700 rounded-xl p-4 text-center ${className}`}>
        <p className="text-xs text-muted">Ad Space</p>
      </div>
    );
  }

  return (
    <div ref={adRef} className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
