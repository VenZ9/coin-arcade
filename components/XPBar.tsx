"use client";

import React from "react";
import { useArcade } from "@/lib/store";

export function XPBar({ compact = false }: { compact?: boolean }) {
  const { state, progress, hydrated } = useArcade();

  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-ink">
          Level {hydrated ? progress.level : "—"}
        </span>
        <span className="tabular-nums text-muted">
          {hydrated
            ? progress.maxed
              ? "MAX"
              : `${progress.into} / ${progress.need} XP`
            : "—"}
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-surface2"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={hydrated ? progress.pct : 0}
        aria-label="Experience progress"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${hydrated ? progress.pct : 0}%` }}
        />
      </div>
      {!compact ? (
        <div className="mt-1 text-[11px] text-muted">
          {hydrated ? `${state.xp.toLocaleString("en-US")} total XP` : ""}
        </div>
      ) : null}
    </div>
  );
}
