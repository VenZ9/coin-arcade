"use client";

import React, { useEffect, useRef, useState } from "react";
import { GameButton } from "../GameButton";
import { ResultPanel } from "../ResultPanel";
import { WagerPicker } from "../WagerPicker";
import { useGameFlow } from "./useGameFlow";
import { optNum, optStr, type EngineProps } from "./shared";
import { randInt } from "@/lib/rewards";

export function MultiplierEngine({ game }: EngineProps) {
  const flow = useGameFlow(game);
  const mode = optStr(game.options, "mode", "crash");
  const growth = optNum(game.options, "growth", 0.06);
  const tickMs = optNum(game.options, "tickMs", 120);

  const [mult, setMult] = useState(1);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [doors, setDoors] = useState<boolean[]>([]);
  const [lastRoll, setLastRoll] = useState<number | null>(null);

  const multRef = useRef(1);
  const bustRef = useRef(0);
  const settleRef = useRef(flow.settle);
  settleRef.current = flow.settle;

  const isTimed = mode === "crash" || mode === "rocket";

  useEffect(() => {
    if (!running || !isTimed) return;
    const id = window.setInterval(() => {
      multRef.current = multRef.current + growth;
      setMult(multRef.current);
      if (multRef.current >= bustRef.current) {
        window.clearInterval(id);
        setRunning(false);
        settleRef.current({
          won: false,
          multiplier: 0,
          detail: `Busted at ${bustRef.current.toFixed(2)}×.`,
        });
      }
    }, tickMs);
    return () => window.clearInterval(id);
  }, [running, isTimed, growth, tickMs]);

  const newDoors = () => {
    const trap = randInt(0, 2);
    return [0, 1, 2].map((i) => i === trap);
  };

  const start = () => {
    if (!flow.canAfford) return;
    multRef.current = 1;
    setMult(1);
    setStep(0);
    setLastRoll(null);
    flow.setStatus("playing");
    if (isTimed) {
      bustRef.current = 1.05 + Math.random() * 6;
      setRunning(true);
    } else if (mode === "tower") {
      setDoors(newDoors());
    }
  };

  const collect = () => {
    setRunning(false);
    settleRef.current({
      won: true,
      multiplier: multRef.current,
      detail: `Collected at ${multRef.current.toFixed(2)}×.`,
    });
  };

  const pickDoor = (i: number) => {
    if (doors[i]) {
      settleRef.current({ won: false, multiplier: 0, detail: "That door hid the trap." });
      return;
    }
    multRef.current = multRef.current * 1.4;
    setMult(multRef.current);
    setStep((s) => s + 1);
    setDoors(newDoors());
  };

  const climb = () => {
    if (Math.random() < 0.8) {
      multRef.current = multRef.current * 1.25;
      setMult(multRef.current);
      setStep((s) => s + 1);
    } else {
      settleRef.current({ won: false, multiplier: 0, detail: "The rung gave way." });
    }
  };

  const rollLadder = () => {
    const need = 3 + step;
    const r = randInt(1, 6);
    setLastRoll(r);
    if (r >= need) {
      multRef.current = multRef.current * 1.3;
      setMult(multRef.current);
      setStep((s) => s + 1);
    } else {
      settleRef.current({
        won: false,
        multiplier: 0,
        detail: `Rolled ${r}, needed ${need} or more.`,
      });
    }
  };

  const again = () => {
    flow.reset();
    setMult(1);
    multRef.current = 1;
    setStep(0);
    setDoors([]);
    setLastRoll(null);
  };

  const playing = flow.status === "playing";

  return (
    <div className="space-y-4">
      <WagerPicker value={flow.wager} onChange={flow.setWager} disabled={playing} />

      <div className="rounded-xl border border-line bg-surface p-6 text-center">
        <div className="text-[10px] uppercase tracking-widest text-muted">
          {mode === "tower" ? `Floor ${step}` : mode === "ladder" ? `Rung ${step}` : mode === "diceLadder" ? `Rung ${step}` : "Multiplier"}
        </div>
        <div className="mt-1 text-4xl font-semibold tabular-nums text-coin">
          {mult.toFixed(2)}×
        </div>
        {lastRoll !== null && mode === "diceLadder" ? (
          <div className="mt-1 text-xs text-muted">Last roll: {lastRoll}</div>
        ) : null}
      </div>

      {mode === "tower" && playing ? (
        <div className="grid grid-cols-3 gap-2">
          {doors.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => pickDoor(i)}
              className="flex h-20 items-center justify-center rounded-xl border border-line bg-surface2 text-2xl transition-colors hover:border-accent/50"
              aria-label={`Door ${i + 1}`}
            >
              🚪
            </button>
          ))}
        </div>
      ) : null}

      {!playing ? (
        <GameButton full size="lg" onClick={start} disabled={!flow.canAfford}>
          Play
        </GameButton>
      ) : isTimed ? (
        <GameButton full size="lg" variant="danger" onClick={collect}>
          Collect {mult.toFixed(2)}×
        </GameButton>
      ) : mode === "tower" ? (
        <GameButton full size="lg" variant="secondary" onClick={collect}>
          Collect {mult.toFixed(2)}×
        </GameButton>
      ) : mode === "ladder" ? (
        <div className="grid grid-cols-2 gap-2">
          <GameButton size="lg" onClick={climb}>
            Climb
          </GameButton>
          <GameButton size="lg" variant="secondary" onClick={collect}>
            Collect
          </GameButton>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <GameButton size="lg" onClick={rollLadder}>
            Roll
          </GameButton>
          <GameButton size="lg" variant="secondary" onClick={collect}>
            Collect
          </GameButton>
        </div>
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
