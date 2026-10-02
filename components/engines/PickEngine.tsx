"use client";

import React, { useState } from "react";
import { GameButton } from "../GameButton";
import { ResultPanel } from "../ResultPanel";
import { WagerPicker } from "../WagerPicker";
import { RewardReveal } from "../RewardReveal";
import { useGameFlow } from "./useGameFlow";
import { optArr, optNum, optStr, type EngineProps } from "./shared";
import { randInt } from "@/lib/rewards";

export function PickEngine({ game }: EngineProps) {
  const flow = useGameFlow(game);
  const choices = optArr<string>(game.options, "choices", ["A", "B"]);
  const multiplier = optNum(game.options, "multiplier", 2);
  const consolation = optNum(game.options, "consolation", 0);
  const visual = optStr(game.options, "visual", "plain");
  const [pick, setPick] = useState<number | null>(null);
  const [winner, setWinner] = useState<number | null>(null);

  const play = () => {
    if (pick === null || !flow.canPlay) return;
    flow.setStatus("playing");
    setWinner(null);
    window.setTimeout(() => {
      const w = randInt(0, choices.length - 1);
      setWinner(w);
      const hit = w === pick;
      if (hit) {
        flow.settle({
          won: true,
          multiplier,
          detail: `${choices[w]} — correct!`,
        });
      } else if (consolation > 0) {
        flow.settle({
          won: false,
          multiplier: consolation,
          detail: `It was ${choices[w]}. Small consolation.`,
        });
      } else {
        flow.settle({
          won: false,
          multiplier: 0,
          detail: `It was ${choices[w]}.`,
        });
      }
    }, 700);
  };

  const again = () => {
    flow.reset();
    setPick(null);
    setWinner(null);
  };

  const glyph = (i: number) => {
    if (visual === "coin") return i === 0 ? "🪙" : "🌑";
    if (visual === "color")
      return ["🔴", "🔵", "🟢", "🟡"][i % 4];
    if (visual === "cup") return "🥤";
    if (visual === "box") return "🎁";
    if (visual === "door") return "🚪";
    if (visual === "gem") return "💎";
    if (visual === "map") return "🗺️";
    if (visual === "safe") return "🔐";
    if (visual === "ticket") return "🎟️";
    return choices[i].slice(0, 1);
  };

  return (
    <div className="space-y-4">
      <WagerPicker
        value={flow.wager}
        onChange={flow.setWager}
        disabled={flow.status === "playing"}
      />

      <div
        className={`grid gap-2 ${
          choices.length > 4 ? "grid-cols-3" : "grid-cols-2"
        }`}
      >
        {choices.map((c, i) => {
          const selected = pick === i;
          const isWinner = winner === i;
          return (
            <button
              key={c}
              type="button"
              disabled={flow.status === "playing"}
              onClick={() => setPick(i)}
              aria-pressed={selected}
              className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-medium transition-colors disabled:cursor-not-allowed ${
                isWinner
                  ? "border-good/60 bg-good/10 text-good"
                  : selected
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-line bg-surface2 text-muted hover:text-ink"
              }`}
            >
              <span className="text-xl" aria-hidden>
                {glyph(i)}
              </span>
              {c}
            </button>
          );
        })}
      </div>

      <GameButton
        full
        size="lg"
        onClick={play}
        disabled={pick === null || !flow.canPlay || flow.status === "playing"}
      >
        {flow.status === "playing" ? "Playing…" : "Play"}
      </GameButton>

      <ResultPanel
        status={flow.status}
        message={flow.message}
        net={flow.net}
        xp={flow.xp}
        onPlayAgain={flow.status === "idle" ? undefined : again}
        disabled={!flow.canPlay}
      />

      {flow.itemId ? (
        <RewardReveal itemId={flow.itemId} onClose={() => flow.setItemId(null)} />
      ) : null}
    </div>
  );
}
