"use client";

import React, { useState } from "react";
import { GameButton } from "../GameButton";
import { ResultPanel } from "../ResultPanel";
import { WagerPicker } from "../WagerPicker";
import { useGameFlow } from "./useGameFlow";
import type { EngineProps } from "./shared";
import { randInt } from "@/lib/rewards";

const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const SUITS = ["♠", "♥", "♦", "♣"];

function draw(): number {
  return randInt(1, 13);
}

function handValue(cards: number[]): number {
  let total = 0;
  let aces = 0;
  for (const c of cards) {
    if (c === 1) {
      aces++;
      total += 11;
    } else if (c >= 10) total += 10;
    else total += c;
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

function label(c: number, i: number) {
  return `${RANKS[c - 1]}${SUITS[i % 4]}`;
}

export function BlackjackEngine({ game }: EngineProps) {
  const flow = useGameFlow(game);
  const [player, setPlayer] = useState<number[]>([]);
  const [dealer, setDealer] = useState<number[]>([]);
  const [active, setActive] = useState(false);
  const [hideHole, setHideHole] = useState(true);

  const start = () => {
    if (!flow.canAfford) return;
    flow.setStatus("playing");
    setPlayer([draw(), draw()]);
    setDealer([draw(), draw()]);
    setActive(true);
    setHideHole(true);
  };

  const finish = (p: number[], d: number[]) => {
    setActive(false);
    setHideHole(false);
    const pv = handValue(p);
    const dv = handValue(d);
    const natural = p.length === 2 && pv === 21;
    if (pv > 21) {
      flow.settle({ won: false, multiplier: 0, detail: `You bust with ${pv}.` });
    } else if (dv > 21) {
      flow.settle({ won: true, multiplier: 2, detail: `Dealer busts with ${dv}.` });
    } else if (pv > dv) {
      flow.settle({
        won: true,
        multiplier: natural ? 2.4 : 2,
        detail: natural ? "Natural 21!" : `${pv} beats ${dv}.`,
      });
    } else if (pv === dv) {
      flow.settle({ won: false, multiplier: 1, push: true, detail: `Both ${pv}. Push.` });
    } else {
      flow.settle({ won: false, multiplier: 0, detail: `${dv} beats ${pv}.` });
    }
  };

  const hit = () => {
    const p = [...player, draw()];
    setPlayer(p);
    if (handValue(p) > 21) finish(p, dealer);
  };

  const stand = () => {
    const d = [...dealer];
    while (handValue(d) < 17) d.push(draw());
    setDealer(d);
    finish(player, d);
  };

  const again = () => {
    flow.reset();
    setPlayer([]);
    setDealer([]);
    setActive(false);
    setHideHole(true);
  };

  const playing = flow.status === "playing";

  const Hand = ({
    cards,
    hidden,
    title,
  }: {
    cards: number[];
    hidden: boolean;
    title: string;
  }) => (
    <div>
      <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wide text-muted">
        <span>{title}</span>
        <span className="tabular-nums">
          {cards.length === 0
            ? "—"
            : hidden
              ? handValue(cards.slice(0, 1))
              : handValue(cards)}
        </span>
      </div>
      <div className="flex gap-1.5">
        {cards.length === 0 ? (
          <div className="flex h-20 w-14 items-center justify-center rounded-lg border border-dashed border-line text-muted">
            🂠
          </div>
        ) : (
          cards.map((c, i) => (
            <div
              key={i}
              className="flex h-20 w-14 items-center justify-center rounded-lg border border-line bg-surface2 text-lg font-semibold text-ink"
            >
              {hidden && i === 1 ? "🂠" : label(c, i)}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <WagerPicker value={flow.wager} onChange={flow.setWager} disabled={playing} />

      <div className="space-y-3 rounded-xl border border-line bg-surface p-4">
        <Hand cards={dealer} hidden={hideHole} title="Dealer" />
        <Hand cards={player} hidden={false} title="You" />
      </div>

      {!playing ? (
        <GameButton full size="lg" onClick={start} disabled={!flow.canAfford}>
          Play
        </GameButton>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <GameButton size="lg" onClick={hit}>
            Hit
          </GameButton>
          <GameButton size="lg" variant="secondary" onClick={stand}>
            Stand
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
