"use client";

import React, { useState } from "react";
import { GameButton } from "../GameButton";
import { ResultPanel } from "../ResultPanel";
import { WagerPicker } from "../WagerPicker";
import { useGameFlow } from "./useGameFlow";
import { optNum, type EngineProps } from "./shared";

const PAYOUTS = [10, 3, 1.5, 0.5, 0.2, 0.5, 1.5, 3, 10];

export function PlinkoEngine({ game }: EngineProps) {
  const flow = useGameFlow(game);
  const rows = optNum(game.options, "rows", 8);
  const slots = optNum(game.options, "slots", 9);
  const [startCol, setStartCol] = useState(Math.floor(slots / 2));
  const [ballCol, setBallCol] = useState<number | null>(null);
  const [landed, setLanded] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const play = () => {
    if (!flow.canPlay) return;
    flow.setStatus("playing");
    setBusy(true);
    setLanded(null);
    let col = startCol;
    setBallCol(col);
    let step = 0;
    const id = window.setInterval(() => {
      col = Math.max(0, Math.min(slots - 1, col + (Math.random() < 0.5 ? -1 : 1)));
      setBallCol(col);
      step++;
      if (step >= rows) {
        window.clearInterval(id);
        setBusy(false);
        setLanded(col);
        const mult = PAYOUTS[col] ?? 0.2;
        flow.settle({
          won: mult > 1,
          multiplier: mult,
          detail: `Landed in slot ${col + 1} — ${mult}×.`,
        });
      }
    }, 110);
  };

  const again = () => {
    flow.reset();
    setBallCol(null);
    setLanded(null);
  };

  return (
    <div className="space-y-4">
      <WagerPicker value={flow.wager} onChange={flow.setWager} disabled={busy} />

      <div>
        <div className="mb-2 text-xs font-medium text-muted">Drop position</div>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: slots }, (_, i) => (
            <button
              key={i}
              type="button"
              disabled={busy}
              onClick={() => setStartCol(i)}
              aria-pressed={startCol === i}
              className={`h-8 w-8 rounded-lg border text-xs font-medium tabular-nums transition-colors ${
                startCol === i
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-line bg-surface2 text-muted hover:text-ink"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface p-4">
        <div className="flex items-end justify-center gap-1">
          {Array.from({ length: slots }, (_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="flex h-16 items-end">
                {ballCol === i ? (
                  <span className="animate-pulse text-xl" aria-hidden>
                    ⚪
                  </span>
                ) : null}
              </div>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-md border text-[10px] font-semibold tabular-nums ${
                  landed === i
                    ? "border-coin/60 bg-coin/15 text-coin"
                    : "border-line bg-surface2 text-muted"
                }`}
              >
                {PAYOUTS[i] ?? 0.2}×
              </div>
            </div>
          ))}
        </div>
      </div>

      <GameButton full size="lg" onClick={play} disabled={!flow.canPlay || busy}>
        {busy ? "Dropping…" : "Play"}
      </GameButton>

      <ResultPanel
        status={flow.status}
        message={flow.message}
        net={flow.net}
        xp={flow.xp}
        onPlayAgain={flow.status === "idle" ? undefined : again}
        disabled={!flow.canPlay}
      />
    </div>
  );
}
