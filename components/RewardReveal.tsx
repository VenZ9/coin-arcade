"use client";

import React from "react";
import { GameButton } from "./GameButton";
import { ITEM_MAP } from "@/lib/items";
import { RARITY_META } from "@/lib/rewards";

export function RewardReveal({
  itemId,
  onClose,
}: {
  itemId: string;
  onClose: () => void;
}) {
  const item = ITEM_MAP[itemId];
  if (!item) return null;
  const meta = RARITY_META[item.rarity];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Item found"
    >
      <div
        className={`animate-pop w-full max-w-xs rounded-2xl border p-6 text-center ${meta.border} ${meta.bg} bg-surface`}
      >
        <div className="text-[11px] uppercase tracking-widest text-muted">
          Item found
        </div>
        <div className="my-4 text-6xl" aria-hidden>
          {item.icon}
        </div>
        <div className="text-lg font-semibold text-ink">{item.name}</div>
        <div className={`mt-1 text-xs font-medium ${meta.text}`}>
          {meta.label}
        </div>
        <p className="mt-2 text-xs text-muted">{item.description}</p>
        <GameButton full className="mt-5" onClick={onClose}>
          Nice
        </GameButton>
      </div>
    </div>
  );
}
