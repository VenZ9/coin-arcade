"use client";

import React from "react";
import { useArcade } from "@/lib/store";
import { formatCoins } from "@/lib/rewards";

export function CoinBalance({
  size = "md",
  showLabel = true,
}: {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}) {
  const { state, hydrated } = useArcade();
  const text =
    size === "lg" ? "text-3xl" : size === "sm" ? "text-sm" : "text-xl";
  const icon = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-lg";

  return (
    <div className="flex items-center gap-2">
      <span className={icon} aria-hidden>
        🪙
      </span>
      <div className="leading-none">
        {showLabel ? (
          <div className="text-[10px] uppercase tracking-wide text-muted">
            Coins
          </div>
        ) : null}
        <div className={`font-semibold tabular-nums text-coin ${text}`}>
          {hydrated ? formatCoins(state.coins) : "—"}
        </div>
      </div>
    </div>
  );
}
