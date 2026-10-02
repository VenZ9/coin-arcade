"use client";

import React from "react";
import { useArcade } from "@/lib/store";
import { ACHIEVEMENT_MAP } from "@/lib/achievements";
import { GameButton } from "./GameButton";

export function AchievementToast() {
  const { pendingUnlocks, dismissUnlock } = useArcade();
  const id = pendingUnlocks[0];
  if (!id) return null;
  const a = ACHIEVEMENT_MAP[id];
  if (!a) return null;

  return (
    <div className="fixed inset-x-0 top-3 z-50 mx-auto max-w-app px-4">
      <div className="animate-rise flex items-center gap-3 rounded-xl border border-coin/40 bg-surface p-3 shadow-lg">
        <span className="text-2xl" aria-hidden>
          {a.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-wide text-coin">
            Achievement unlocked
          </div>
          <div className="truncate text-sm font-semibold text-ink">
            {a.name}
          </div>
          <div className="truncate text-xs text-muted">{a.description}</div>
        </div>
        <GameButton size="sm" variant="secondary" onClick={() => dismissUnlock(id)}>
          OK
        </GameButton>
      </div>
    </div>
  );
}
