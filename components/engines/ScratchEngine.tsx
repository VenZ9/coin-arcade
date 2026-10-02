"use client";

import React, { useState } from "react";
import { GameButton } from "../GameButton";
import { ResultPanel } from "../ResultPanel";
import { WagerPicker } from "../WagerPicker";
import { useGameFlow } from "./useGameFlow";
import { optNum, type EngineProps } from "./shared";
import { randInt } from "@/lib/rewards";

const SYMBOLS = ["🍒", "🍋", "🔔", "⭐", "💎"];

export function ScratchEngine({ game }: EngineProps) {
  const flow = useGameFlow(game);
  const panels = optNum(game.options, "panels", 3);
  const [faces, setFaces] = useState<string[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [active, setActive] = useState(false);

  const start = () => {
    if (!flow.canAfford) return;
    flow.setStatus("playing");
    const roll = Math.random();
    let result: string[];
    if (roll < 0.12) {
      const s = SYMBOLS[randInt(0, SYMBOLS.length - 1)];
      result = Array.from({ length: panels }, () => s);
    } else if (roll < 0.45) {
      const s = SYMBOLS[randInt(0, SYMBOLS.length - 1)];
      const other = SYMBOLS.filter((x) => x !== s)[0];
      result = [s, s, other].slice(0, panels);
    } else {
      const pool = [...SYMBOLS];
      result = Array.from({ length: panels }, () => {
        const i = randInt(0, pool.length - 1);
        return pool.splice(i, 1)[0] ?? SYMBOLS[0];
      });
    }
    setFaces(result);
    setRevealed(Array.from({ length: panels }, () => false));
    setActive(true);
  };

  const scratch = (i: number) => {
    if (!active || revealed[i]) return;
    const next = revealed.map((r, idx) => (idx === i ? true : r));
    setRevealed(next);
    if (next.every(Boolean)) {
      setActive(false);
      const counts: Record<string, number> = {};
      for (const f of faces) counts[f] = (counts[f] ?? 0) + 1;
      const best = Math.max(...Object.values(counts));
      if (best === panels)
        flow.settle({ won: true, multiplier: 10, detail: "All three match!" });
      else if (best === panels - 1)
        flow.settle({ won: true, multiplier: 2, detail: "Two match." });
      else flow.settle({ won: false, multiplier: 0, detail: "No match." });
    }
  };

  const again = () => {
    flow.reset();
    setFaces([]);
    setRevealed([]);
    setActive(false);
  };

  const playing = flow.status === "playing";

  return (
    <div className="space-y-4">
      <WagerPicker value={flow.wager} onChange={flow.setWager} disabled={playing} />

      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: panels }, (_, i) => {
          const shown = revealed[i];
          return (
            <button
              key={i}
              type="button"
              disabled={!active || shown}
              onClick={() => scratch(i)}
              aria-label={`Panel ${i + 1}`}
              className={`flex aspect-square items-center justify-center rounded-xl border text-3xl transition-colors ${
                shown
                  ? "border-coin/50 bg-coin/10"
                  : "border-line bg-surface2 hover:border-accent/50"
              } disabled:cursor-not-allowed`}
            >
              {shown ? faces[i] : "❓"}
            </button>
          );
        })}
      </div>

      {!playing ? (
        <GameButton full size="lg" onClick={start} disabled={!flow.canAfford}>
          Play
        </GameButton>
      ) : (
        <p className="text-center text-xs text-muted">
          Tap each panel to scratch it.
        </p>
      )}

      {!flow.canAfford ? (
        <p className="text-center text-xs text-bad">Not enough Coins.</p>
      ) : null}

      <ResultPanel
        status={flow.status}
        message={flow.message}
        net={flow.net}
        xp={flow.xp}
        onPlayAgain={flow.status === "idle" ? undefined : again}
        disabled={!flow.canAfford}
      />
    </div>
  );
}
