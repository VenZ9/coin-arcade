"use client";

import React, { useState } from "react";
import { GameButton } from "../GameButton";
import { ResultPanel } from "../ResultPanel";
import { WagerPicker } from "../WagerPicker";
import { Grid, type GridCell } from "../Grid";
import { useGameFlow } from "./useGameFlow";
import { optNum, optStr, type EngineProps } from "./shared";
import { randInt, shuffle } from "@/lib/rewards";

/** Fair multiplier for surviving `revealed` picks out of `total` with `mines` bad tiles. */
function survivalMult(total: number, mines: number, revealed: number, edge = 0.95) {
  const safe = total - mines;
  let p = 1;
  for (let i = 0; i < revealed; i++) p *= (safe - i) / (total - i);
  if (p <= 0) return 0;
  return Math.max(1, Math.round((edge / p) * 100) / 100);
}

export function GridEngine({ game }: EngineProps) {
  const flow = useGameFlow(game);
  const size = optNum(game.options, "size", 5);
  const mineCount = optNum(game.options, "mines", 3);
  const hunt = optStr(game.options, "mode", "") === "hunt";
  const total = size * size;

  const [cells, setCells] = useState<GridCell[]>([]);
  const [mult, setMult] = useState(1);
  const [active, setActive] = useState(false);
  const [target, setTarget] = useState(-1);

  const start = () => {
    if (!flow.canAfford) return;
    flow.setStatus("playing");
    setMult(1);
    setActive(true);
    if (hunt) {
      const t = randInt(0, total - 1);
      setTarget(t);
      setCells(
        Array.from({ length: total }, (_, i) => ({
          id: i,
          revealed: false,
          isMine: i === t,
        }))
      );
    } else {
      const flags = shuffle(
        Array.from({ length: total }, (_, i) => i < mineCount)
      );
      setCells(
        Array.from({ length: total }, (_, i) => ({
          id: i,
          revealed: false,
          isMine: flags[i],
        }))
      );
    }
  };

  const reveal = (id: number) => {
    if (!active) return;
    const cell = cells[id];
    if (!cell || cell.revealed) return;

    if (hunt) {
      if (cell.isMine) {
        setCells((cs) => cs.map((c) => (c.id === id ? { ...c, revealed: true } : c)));
        setActive(false);
        flow.settle({
          won: true,
          multiplier: mult,
          detail: `Found it at ${mult.toFixed(2)}×!`,
        });
        return;
      }
      const revealedCount = cells.filter((c) => c.revealed).length + 1;
      const next = Math.max(1, Math.round((total / (total - revealedCount)) * 0.95 * 100) / 100);
      setMult(next);
      setCells((cs) => cs.map((c) => (c.id === id ? { ...c, revealed: true } : c)));
      return;
    }

    if (cell.isMine) {
      setCells((cs) =>
        cs.map((c) => (c.isMine ? { ...c, revealed: true } : c))
      );
      setActive(false);
      flow.settle({ won: false, multiplier: 0, detail: "You hit a mine." });
      return;
    }
    const revealedCount = cells.filter((c) => c.revealed && !c.isMine).length + 1;
    setMult(survivalMult(total, mineCount, revealedCount));
    setCells((cs) => cs.map((c) => (c.id === id ? { ...c, revealed: true } : c)));
  };

  const collect = () => {
    setActive(false);
    flow.settle({
      won: true,
      multiplier: mult,
      detail: `Collected at ${mult.toFixed(2)}×.`,
    });
  };

  const again = () => {
    flow.reset();
    setCells([]);
    setMult(1);
    setActive(false);
    setTarget(-1);
  };

  const playing = flow.status === "playing";

  return (
    <div className="space-y-4">
      <WagerPicker value={flow.wager} onChange={flow.setWager} disabled={playing} />

      <div className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3">
        <span className="text-[10px] uppercase tracking-widest text-muted">
          Multiplier
        </span>
        <span className="text-xl font-semibold tabular-nums text-coin">
          {mult.toFixed(2)}×
        </span>
      </div>

      {cells.length > 0 ? (
        <Grid cells={cells} cols={size} onReveal={reveal} disabled={!active} />
      ) : (
        <div className="rounded-xl border border-dashed border-line bg-surface/50 p-8 text-center text-xs text-muted">
          Press Play to lay out the grid.
        </div>
      )}

      {!playing ? (
        <GameButton full size="lg" onClick={start} disabled={!flow.canAfford}>
          Play
        </GameButton>
      ) : (
        <GameButton full size="lg" variant="secondary" onClick={collect}>
          Collect {mult.toFixed(2)}×
        </GameButton>
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
