"use client";

import { useCallback, useState } from "react";
import type { GameConfig } from "@/lib/games";
import { useArcade } from "@/lib/store";
import { xpForPlay } from "@/lib/levels";

export type FlowStatus = "idle" | "playing" | "won" | "lost" | "push";

export interface SettleOptions {
  won: boolean;
  multiplier: number;
  push?: boolean;
  detail?: string;
  itemId?: string;
}

export function useGameFlow(game: GameConfig) {
  const { state, play } = useArcade();
  const [wager, setWager] = useState(10);
  const [status, setStatus] = useState<FlowStatus>("idle");
  const [message, setMessage] = useState("");
  const [net, setNet] = useState(0);
  const [xp, setXp] = useState(0);
  const [itemId, setItemId] = useState<string | null>(null);

  const canAfford = state.coins >= wager;

  const settle = useCallback(
    (opts: SettleOptions) => {
      const stake = wager;
      const payout = opts.push
        ? stake
        : Math.max(0, Math.floor(stake * opts.multiplier));
      const gainedXp = xpForPlay(stake, opts.won);
      play(game.id, stake, {
        won: opts.won,
        payout,
        detail: opts.detail,
        itemId: opts.itemId,
        push: opts.push,
      });
      setNet(payout - stake);
      setXp(gainedXp);
      setMessage(opts.detail ?? "");
      setItemId(opts.itemId ?? null);
      setStatus(opts.push ? "push" : opts.won ? "won" : "lost");
    },
    [game.id, play, wager]
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setMessage("");
    setNet(0);
    setXp(0);
    setItemId(null);
  }, []);

  return {
    state,
    wager,
    setWager,
    status,
    setStatus,
    message,
    setMessage,
    net,
    xp,
    itemId,
    setItemId,
    canAfford,
    settle,
    reset,
  };
}
