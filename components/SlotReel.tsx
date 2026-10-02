"use client";

import React from "react";

export function SlotReel({
  symbol,
  spinning = false,
  highlight = false,
}: {
  symbol: string;
  spinning?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex h-20 w-20 items-center justify-center rounded-lg border text-4xl transition-colors ${
        highlight
          ? "border-coin/60 bg-coin/10"
          : "border-line bg-surface2"
      } ${spinning ? "animate-pulse" : ""}`}
      aria-hidden
    >
      {symbol}
    </div>
  );
}
