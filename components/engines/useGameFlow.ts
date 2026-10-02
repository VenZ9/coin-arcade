"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GameConfig } from "@/lib/games";
import { useArcade } from "@/lib/store";
import { xpForPlay } from "@/lib/levels";
import {
  DEFAULT_WAGER,
  MIN_WAGER,
  clampWager,
  validateWager,
  type WagerValidation,
} from "@/lib/wager";

export type FlowStatus = "idle" | "playing" | "won" | "lost" | "push";

export interface SettleOptions {
  won: boolean;
  multiplier: number;
  push?: boolean;
  detail?: string;
  itemId?: string;
}

/**
 * Shared round lifecycle for every minigame.
 *
 * Owns the wager, its validation, and the single path that settles a round
 * through the central economy — so all 38 games share identical betting,
 * payout, XP, statistics and history behaviour. Engines never do any of this
 * themselves.
 */
export function useGameFlow(game: GameConfig) {
  const { state, hydrated, play, updateSettings } = useArcade();
  const [wager, setWagerState] = useState<number>(DEFAULT_WAGER);
  const [status, setStatus] = useState<FlowStatus>("idle");
  const [message, setMessage] = useState("");
  const [net, setNet] = useState(0);
  const [xp, setXp] = useState(0);
  const [itemId, setItemId] = useState<string | null>(null);
  const restored = useRef(false);

  // Restore the last wager the player used, once the save has hydrated.
  useEffect(() => {
    if (!hydrated || restored.current) return;
    restored.current = true;
    const saved = state.settings.lastWager;
    if (Number.isFinite(saved) && saved >= MIN_WAGER) {
      setWagerState(Math.floor(saved));
    }
  }, [hydrated, state.settings.lastWager]);

  const validation = useMemo<WagerValidation>(
    () => validateWager(wager, state.coins),
    [wager, state.coins]
  );

  const canAfford = Number.isFinite(wager) && state.coins >= wager;

  /** A round may start only when the wager is legal AND covered by the balance. */
  const canPlay = validation.ok && canAfford;

  // Remember the wager for next time. Only legal values are persisted, so an
  // empty or over-balance field never becomes the next session's default.
  useEffect(() => {
    if (!hydrated || !validation.ok) return;
    if (state.settings.lastWager === wager) return;
    const id = window.setTimeout(() => updateSettings({ lastWager: wager }), 300);
    return () => window.clearTimeout(id);
  }, [wager, validation.ok, hydrated, state.settings.lastWager, updateSettings]);

  const setWager = useCallback((next: number) => {
    setWagerState(Number.isFinite(next) ? next : 0);
  }, []);

  const settle = useCallback(
    (opts: SettleOptions) => {
      const stake = clampWager(wager);
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
    canPlay,
    validation,
    settle,
    reset,
  };
}
