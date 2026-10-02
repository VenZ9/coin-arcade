"use client";

import React from "react";

export interface GridCell {
  id: number;
  revealed: boolean;
  isMine: boolean;
  label?: string;
}

export function Grid({
  cells,
  cols,
  onReveal,
  disabled = false,
}: {
  cells: GridCell[];
  cols: number;
  onReveal: (id: number) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {cells.map((c) => {
        const base =
          "flex aspect-square items-center justify-center rounded-lg border text-lg font-semibold transition-colors";
        if (!c.revealed) {
          return (
            <button
              key={c.id}
              type="button"
              disabled={disabled}
              onClick={() => onReveal(c.id)}
              aria-label={`Tile ${c.id + 1}`}
              className={`${base} border-line bg-surface2 text-muted hover:border-accent/50 hover:bg-surface2/70 disabled:cursor-not-allowed disabled:opacity-60`}
            >
              ?
            </button>
          );
        }
        return (
          <div
            key={c.id}
            className={`${base} ${
              c.isMine
                ? "border-bad/50 bg-bad/15 text-bad"
                : "border-good/40 bg-good/10 text-good"
            }`}
          >
            {c.label ?? (c.isMine ? "💣" : "💎")}
          </div>
        );
      })}
    </div>
  );
}
