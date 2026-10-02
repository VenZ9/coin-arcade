"use client";

import React, { useState } from "react";
import { GameButton } from "../GameButton";
import { ResultPanel } from "../ResultPanel";
import { WagerPicker } from "../WagerPicker";
import { useGameFlow } from "./useGameFlow";
import { optNum, type EngineProps } from "./shared";
import { randInt } from "@/lib/rewards";

const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const SUITS = ["♠", "♥", "♦", "♣"];

function cardLabel(v: number) {
  return `${RANKS[v - 2]}${SUITS[v % 4]}`;
}

export function HighCardEngine({ game }: EngineProps) {
  const flow = useGameFlow(game);
  const multiplier = optNum(game.options, "multiplier", 1.9);
  const [mine, setMine] = useState<number | null>(null);
  const [theirs, setTheirs] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const play = () => {
    if (!flow.canPlay) return;
    flow.setStatus("playing");
    setBusy(true);
    setMine(null);
    setTheirs(null);
    window.setTimeout(() => {
      const a = randInt(2, 14);
      const b = randInt(2, 14);
      setMine(a);
      setTheirs(b);
      setBusy(false);
      if (a > b)
        flow.settle({ won: true, multiplier, detail: `${cardLabel(a)} beats ${cardLabel(b)}.` });
      else if (a === b)
        flow.settle({ won: false, multiplier: 1, push: true, detail: `Both drew ${cardLabel(a)}. Push.` });
      else flow.settle({ won: false, multiplier: 0, detail: `${cardLabel(b)} beats ${cardLabel(a)}.` });
    }, 700);
  };

  const again = () => {
    flow.reset();
    setMine(null);
    setTheirs(null);
  };

  const CardFace = ({ v, label }: { v: number | null; label: string }) => (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] uppercase tracking-wide text-muted">{label}</span>
      <div className="flex h-24 w-16 items-center justify-center rounded-lg border border-line bg-surface2 text-2xl font-semibold text-ink">
        {v === null ? "🂠" : cardLabel(v)}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <WagerPicker value={flow.wager} onChange={flow.setWager} disabled={busy} />

      <div className="flex items-center justify-center gap-6 rounded-xl border border-line bg-surface p-4">
        <CardFace v={mine} label="You" />
        <span className="text-xs text-muted">vs</span>
        <CardFace v={theirs} label="Dealer" />
      </div>

      <GameButton full size="lg" onClick={play} disabled={!flow.canPlay || busy}>
        {busy ? "Dealing…" : "Play"}
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
