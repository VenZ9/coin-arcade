"use client";

import React from "react";
import { WAGER_OPTIONS } from "@/lib/games";
import { formatCoins } from "@/lib/rewards";
import { useArcade } from "@/lib/store";

export function WagerPicker({
  value,
  onChange,
  disabled = false,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  const { state } = useArcade();
  const options = WAGER_OPTIONS.filter((o) => o <= Math.max(state.coins, 10));
  const list = options.length ? options : [10];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted">Wager</span>
        <span className="text-xs tabular-nums text-coin">
          {formatCoins(value)} Coins
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {list.map((o) => (
          <button
            key={o}
            type="button"
            disabled={disabled}
            onClick={() => onChange(o)}
            aria-pressed={value === o}
            className={`h-8 rounded-lg border px-3 text-xs font-medium tabular-nums transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              value === o
                ? "border-accent bg-accent/15 text-accent"
                : "border-line bg-surface2 text-muted hover:text-ink"
            }`}
          >
            {formatCoins(o)}
          </button>
        ))}
      </div>
    </div>
  );
}
