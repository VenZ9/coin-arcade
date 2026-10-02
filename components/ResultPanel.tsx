"use client";

import React from "react";
import { GameButton } from "./GameButton";
import { formatCoins } from "@/lib/rewards";

export interface ResultPanelProps {
  status: "idle" | "playing" | "won" | "lost" | "push";
  message?: string;
  net?: number;
  xp?: number;
  onPlayAgain?: () => void;
  playAgainLabel?: string;
  disabled?: boolean;
}

export function ResultPanel({
  status,
  message,
  net = 0,
  xp = 0,
  onPlayAgain,
  playAgainLabel = "Play Again",
  disabled = false,
}: ResultPanelProps) {
  if (status === "idle") {
    return (
      <div className="rounded-xl border border-dashed border-line bg-surface/50 p-4 text-center text-xs text-muted">
        {message ?? "Set your wager and press Play."}
      </div>
    );
  }

  if (status === "playing") {
    return (
      <div className="rounded-xl border border-line bg-surface p-4 text-center text-sm text-muted">
        {message ?? "Playing…"}
      </div>
    );
  }

  const won = status === "won";
  const push = status === "push";
  const tone = push
    ? "border-line bg-surface"
    : won
      ? "border-good/40 bg-good/10"
      : "border-bad/40 bg-bad/10";
  const label = push ? "Push" : won ? "You won" : "You lost";
  const labelTone = push ? "text-muted" : won ? "text-good" : "text-bad";

  return (
    <div className={`animate-pop rounded-xl border p-4 ${tone}`}>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${labelTone}`}>{label}</span>
        <span
          className={`text-sm font-semibold tabular-nums ${labelTone}`}
        >
          {net > 0 ? `+${formatCoins(net)}` : net < 0 ? formatCoins(net) : "0"}
        </span>
      </div>
      {message ? (
        <p className="mt-1 text-xs text-muted">{message}</p>
      ) : null}
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
        <span>XP gained</span>
        <span className="tabular-nums">+{xp}</span>
      </div>
      {onPlayAgain ? (
        <GameButton
          full
          className="mt-3"
          onClick={onPlayAgain}
          disabled={disabled}
        >
          {playAgainLabel}
        </GameButton>
      ) : null}
    </div>
  );
}
