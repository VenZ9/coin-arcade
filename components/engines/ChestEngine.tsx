"use client";

import React, { useState } from "react";
import { GameButton } from "../GameButton";
import { ResultPanel } from "../ResultPanel";
import { WagerPicker } from "../WagerPicker";
import { RewardReveal } from "../RewardReveal";
import { useGameFlow } from "./useGameFlow";
import { optArr, optNum, type EngineProps } from "./shared";
import { randInt, rollRarity, shuffle } from "@/lib/rewards";
import { randomItemOfRarity } from "@/lib/items";

export function ChestEngine({ game }: EngineProps) {
  const flow = useGameFlow(game);
  const chests = optNum(game.options, "chests", 3);
  const payouts = optArr<number>(game.options, "payouts", [3, 1.2, 0.4]);
  const itemChance = optNum(game.options, "itemChance", 0);
  const [opened, setOpened] = useState<number | null>(null);
  const [assigned, setAssigned] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);

  const play = (i: number) => {
    if (!flow.canAfford || busy) return;
    flow.setStatus("playing");
    setBusy(true);
    const pool = shuffle(
      Array.from({ length: chests }, (_, k) => payouts[k % payouts.length])
    );
    setAssigned(pool);
    window.setTimeout(() => {
      setOpened(i);
      setBusy(false);
      const mult = pool[i];
      const gotItem = itemChance > 0 && Math.random() < itemChance;
      const itemId = gotItem ? randomItemOfRarity(rollRarity(0.3)).id : undefined;
      flow.settle({
        won: mult > 1,
        multiplier: mult,
        detail: gotItem
          ? `A ${mult}× payout and a collectible!`
          : `That chest held ${mult}×.`,
        itemId,
      });
    }, 600);
  };

  const again = () => {
    flow.reset();
    setOpened(null);
    setAssigned([]);
  };

  const playing = flow.status === "playing";

  return (
    <div className="space-y-4">
      <WagerPicker value={flow.wager} onChange={flow.setWager} disabled={playing} />

      <div
        className={`grid gap-2 ${chests > 3 ? "grid-cols-3" : chests === 1 ? "grid-cols-1" : "grid-cols-3"}`}
      >
        {Array.from({ length: chests }, (_, i) => {
          const isOpen = opened === i;
          const revealed = opened !== null;
          return (
            <button
              key={i}
              type="button"
              disabled={playing || revealed}
              onClick={() => play(i)}
              aria-label={`Chest ${i + 1}`}
              className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border text-3xl transition-colors disabled:cursor-not-allowed ${
                isOpen
                  ? "border-coin/60 bg-coin/10"
                  : revealed
                    ? "border-line bg-surface2 opacity-50"
                    : "border-line bg-surface2 hover:border-accent/50"
              }`}
            >
              {isOpen ? "🎉" : "🧰"}
              {revealed && assigned[i] !== undefined ? (
                <span className="text-[10px] font-semibold tabular-nums text-muted">
                  {assigned[i]}×
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {!playing && opened === null ? (
        <p className="text-center text-xs text-muted">
          Pick a chest to open it.
        </p>
      ) : null}

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

      {flow.itemId ? (
        <RewardReveal itemId={flow.itemId} onClose={() => flow.setItemId(null)} />
      ) : null}
    </div>
  );
}
