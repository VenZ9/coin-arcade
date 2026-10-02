"use client";

import React, { useState } from "react";
import { GameButton } from "../GameButton";
import { ResultPanel } from "../ResultPanel";
import { WagerPicker } from "../WagerPicker";
import { Dice } from "../Dice";
import { useGameFlow } from "./useGameFlow";
import { optBool, optNum, type EngineProps } from "./shared";
import { randInt } from "@/lib/rewards";

type Mode = "over" | "under" | "exact";

export function DiceEngine({ game }: EngineProps) {
  const flow = useGameFlow(game);
  const count = optNum(game.options, "dice", 2);
  const sides = optNum(game.options, "sides", 6);
  const duel = optBool(game.options, "duel");
  const poker = optBool(game.options, "poker");

  const [mode, setMode] = useState<Mode>("over");
  const [mine, setMine] = useState<number[]>([]);
  const [theirs, setTheirs] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);

  const roll = (n: number) =>
    Array.from({ length: n }, () => randInt(1, sides));

  const play = () => {
    if (!flow.canAfford) return;
    flow.setStatus("playing");
    setRolling(true);
    window.setTimeout(() => {
      const a = roll(count);
      setMine(a);
      setRolling(false);

      if (duel) {
        const b = roll(1);
        setTheirs(b);
        if (a[0] > b[0])
          flow.settle({ won: true, multiplier: 1.9, detail: `${a[0]} beats ${b[0]}.` });
        else if (a[0] === b[0])
          flow.settle({ won: false, multiplier: 1, push: true, detail: `Both rolled ${a[0]}. Push.` });
        else flow.settle({ won: false, multiplier: 0, detail: `${b[0]} beats ${a[0]}.` });
        return;
      }

      if (poker) {
        const counts: Record<number, number> = {};
        for (const v of a) counts[v] = (counts[v] ?? 0) + 1;
        const groups = Object.values(counts).sort((x, y) => y - x);
        let mult = 0;
        let label = "No pattern.";
        if (groups[0] === 5) {
          mult = 20;
          label = "Five of a kind!";
        } else if (groups[0] === 4) {
          mult = 8;
          label = "Four of a kind!";
        } else if (groups[0] === 3 && groups[1] === 2) {
          mult = 4;
          label = "Full house!";
        } else if (groups[0] === 3) {
          mult = 2;
          label = "Three of a kind.";
        } else if (groups[0] === 2) {
          mult = 1.2;
          label = "A pair.";
        }
        flow.settle({ won: mult > 1, multiplier: mult, detail: label });
        return;
      }

      const sum = a.reduce((s, v) => s + v, 0);
      if (mode === "over") {
        if (sum > 7) flow.settle({ won: true, multiplier: 2.2, detail: `Rolled ${sum} — over 7.` });
        else flow.settle({ won: false, multiplier: 0, detail: `Rolled ${sum} — not over 7.` });
      } else if (mode === "under") {
        if (sum < 7) flow.settle({ won: true, multiplier: 2.2, detail: `Rolled ${sum} — under 7.` });
        else flow.settle({ won: false, multiplier: 0, detail: `Rolled ${sum} — not under 7.` });
      } else {
        if (sum === 7) flow.settle({ won: true, multiplier: 5, detail: "Exactly 7!" });
        else flow.settle({ won: false, multiplier: 0, detail: `Rolled ${sum}.` });
      }
    }, 800);
  };

  const again = () => {
    flow.reset();
    setMine([]);
    setTheirs([]);
  };

  const showModes = !duel && !poker;

  return (
    <div className="space-y-4">
      <WagerPicker value={flow.wager} onChange={flow.setWager} disabled={rolling} />

      {showModes ? (
        <div className="grid grid-cols-3 gap-2">
          {(["over", "under", "exact"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              disabled={rolling}
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`h-9 rounded-lg border text-xs font-medium capitalize transition-colors ${
                mode === m
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-line bg-surface2 text-muted hover:text-ink"
              }`}
            >
              {m === "exact" ? "Exactly 7" : m}
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex min-h-[5rem] items-center justify-center gap-2 rounded-xl border border-line bg-surface p-4">
        {mine.length === 0 ? (
          <span className="text-xs text-muted">Roll to begin</span>
        ) : (
          mine.map((v, i) => (
            <Dice key={i} value={v} sides={sides} rolling={rolling} size="lg" />
          ))
        )}
      </div>

      {theirs.length > 0 ? (
        <div className="flex items-center justify-center gap-2 text-xs text-muted">
          Dealer:
          {theirs.map((v, i) => (
            <Dice key={i} value={v} sides={sides} size="sm" />
          ))}
        </div>
      ) : null}

      <GameButton
        full
        size="lg"
        onClick={play}
        disabled={!flow.canAfford || rolling}
      >
        {rolling ? "Rolling…" : "Play"}
      </GameButton>

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
