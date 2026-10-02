"use client";

import React, { useState } from "react";
import { GameButton } from "../GameButton";
import { ResultPanel } from "../ResultPanel";
import { WagerPicker } from "../WagerPicker";
import { Wheel } from "../Wheel";
import { useGameFlow } from "./useGameFlow";
import { optArr, optStr, type EngineProps } from "./shared";
import { randInt } from "@/lib/rewards";

const DEFAULT_SEGMENTS = [0, 1.5, 0, 2, 0, 1.5, 0, 3, 0, 1.5, 0, 2, 0, 1.5, 0, 5];

export function WheelEngine({ game }: EngineProps) {
  const flow = useGameFlow(game);
  const mode = optStr(game.options, "mode", "wheel");
  const segments = optArr<number>(game.options, "segments", DEFAULT_SEGMENTS);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [bet, setBet] = useState<"red" | "black" | "number">("red");
  const [number, setNumber] = useState(7);

  const spinWheel = () => {
    if (!flow.canPlay) return;
    flow.setStatus("playing");
    setSpinning(true);
    const idx = randInt(0, segments.length - 1);
    const seg = 360 / segments.length;
    const target = 360 * 5 - (idx * seg + seg / 2);
    setRotation((r) => r + target);
    window.setTimeout(() => {
      setSpinning(false);
      const mult = segments[idx];
      flow.settle({
        won: mult > 1,
        multiplier: mult,
        detail: mult === 0 ? "Landed on a blank segment." : `Landed on ${mult}×.`,
      });
    }, 1700);
  };

  const spinRoulette = () => {
    if (!flow.canPlay) return;
    flow.setStatus("playing");
    setSpinning(true);
    window.setTimeout(() => {
      setSpinning(false);
      const n = randInt(0, 36);
      const isRed = n !== 0 && n % 2 === 1;
      if (bet === "number") {
        if (n === number)
          flow.settle({ won: true, multiplier: 30, detail: `The ball landed on ${n}!` });
        else flow.settle({ won: false, multiplier: 0, detail: `The ball landed on ${n}.` });
      } else {
        const hit = (bet === "red" && isRed) || (bet === "black" && n !== 0 && !isRed);
        if (hit)
          flow.settle({ won: true, multiplier: 1.9, detail: `The ball landed on ${n} ${isRed ? "red" : "black"}.` });
        else flow.settle({ won: false, multiplier: 0, detail: `The ball landed on ${n}.` });
      }
    }, 1200);
  };

  const again = () => {
    flow.reset();
  };

  if (mode === "roulette") {
    return (
      <div className="space-y-4">
        <WagerPicker value={flow.wager} onChange={flow.setWager} disabled={spinning} />
        <div className="grid grid-cols-3 gap-2">
          {(["red", "black", "number"] as const).map((b) => (
            <button
              key={b}
              type="button"
              disabled={spinning}
              onClick={() => setBet(b)}
              aria-pressed={bet === b}
              className={`h-9 rounded-lg border text-xs font-medium capitalize transition-colors ${
                bet === b
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-line bg-surface2 text-muted hover:text-ink"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
        {bet === "number" ? (
          <div className="flex items-center gap-3">
            <label htmlFor="roulette-num" className="text-xs text-muted">
              Number (0–36)
            </label>
            <input
              id="roulette-num"
              type="number"
              min={0}
              max={36}
              value={number}
              disabled={spinning}
              onChange={(e) =>
                setNumber(Math.max(0, Math.min(36, Number(e.target.value) || 0)))
              }
              className="h-9 w-20 rounded-lg border border-line bg-surface2 px-2 text-sm text-ink"
            />
          </div>
        ) : null}
        <GameButton full size="lg" onClick={spinRoulette} disabled={!flow.canPlay || spinning}>
          {spinning ? "Spinning…" : "Play"}
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

  return (
    <div className="space-y-4">
      <WagerPicker value={flow.wager} onChange={flow.setWager} disabled={spinning} />
      <div className="flex justify-center py-2">
        <Wheel segments={segments} rotation={rotation} spinning={spinning} />
      </div>
      <GameButton full size="lg" onClick={spinWheel} disabled={!flow.canPlay || spinning}>
        {spinning ? "Spinning…" : "Play"}
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
