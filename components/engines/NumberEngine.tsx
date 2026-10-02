"use client";

import React, { useState } from "react";
import { GameButton } from "../GameButton";
import { ResultPanel } from "../ResultPanel";
import { WagerPicker } from "../WagerPicker";
import { useGameFlow } from "./useGameFlow";
import { optArr, optNum, optStr, type EngineProps } from "./shared";
import { randInt } from "@/lib/rewards";

const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

export function NumberEngine({ game }: EngineProps) {
  const flow = useGameFlow(game);
  const mode = optStr(game.options, "mode", "guess");
  const ranges = optArr<number>(game.options, "ranges", [10, 25, 50, 100]);

  const [range, setRange] = useState(ranges[0] ?? 10);
  const [guess, setGuess] = useState(1);
  const [answer, setAnswer] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const [current, setCurrent] = useState<number | null>(null);
  const [next, setNext] = useState<number | null>(null);

  const playGuess = () => {
    if (!flow.canAfford) return;
    flow.setStatus("playing");
    setBusy(true);
    setAnswer(null);
    window.setTimeout(() => {
      const a = randInt(1, range);
      setAnswer(a);
      setBusy(false);
      const mult = Math.max(1.5, Math.round(range * 0.85 * 100) / 100);
      if (a === guess)
        flow.settle({ won: true, multiplier: mult, detail: `It was ${a}!` });
      else flow.settle({ won: false, multiplier: 0, detail: `It was ${a}.` });
    }, 700);
  };

  const startHigherLower = () => {
    if (!flow.canAfford) return;
    flow.setStatus("playing");
    setNext(null);
    setCurrent(randInt(2, 14));
  };

  const callHigherLower = (higher: boolean) => {
    if (current === null) return;
    const n = randInt(2, 14);
    setNext(n);
    if (n === current) {
      flow.settle({ won: false, multiplier: 1, push: true, detail: `Both ${RANKS[current - 2]}. Push.` });
      return;
    }
    const correct = higher ? n > current : n < current;
    if (correct)
      flow.settle({
        won: true,
        multiplier: 1.9,
        detail: `${RANKS[n - 2]} — correct.`,
      });
    else
      flow.settle({
        won: false,
        multiplier: 0,
        detail: `${RANKS[n - 2]} — wrong call.`,
      });
  };

  const again = () => {
    flow.reset();
    setAnswer(null);
    setCurrent(null);
    setNext(null);
  };

  const playing = flow.status === "playing";

  if (mode === "higherLower") {
    return (
      <div className="space-y-4">
        <WagerPicker value={flow.wager} onChange={flow.setWager} disabled={playing} />
        <div className="flex items-center justify-center gap-6 rounded-xl border border-line bg-surface p-4">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] uppercase tracking-wide text-muted">Current</span>
            <div className="flex h-24 w-16 items-center justify-center rounded-lg border border-line bg-surface2 text-2xl font-semibold text-ink">
              {current === null ? "🂠" : RANKS[current - 2]}
            </div>
          </div>
          <span className="text-xs text-muted">→</span>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] uppercase tracking-wide text-muted">Next</span>
            <div className="flex h-24 w-16 items-center justify-center rounded-lg border border-line bg-surface2 text-2xl font-semibold text-ink">
              {next === null ? "🂠" : RANKS[next - 2]}
            </div>
          </div>
        </div>
        {!playing ? (
          <GameButton full size="lg" onClick={startHigherLower} disabled={!flow.canAfford}>
            Play
          </GameButton>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <GameButton size="lg" onClick={() => callHigherLower(true)}>
              ⬆️ Higher
            </GameButton>
            <GameButton size="lg" onClick={() => callHigherLower(false)}>
              ⬇️ Lower
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

  return (
    <div className="space-y-4">
      <WagerPicker value={flow.wager} onChange={flow.setWager} disabled={busy} />

      <div>
        <div className="mb-2 text-xs font-medium text-muted">Range</div>
        <div className="flex flex-wrap gap-2">
          {ranges.map((r) => (
            <button
              key={r}
              type="button"
              disabled={busy}
              onClick={() => {
                setRange(r);
                setGuess(1);
              }}
              aria-pressed={range === r}
              className={`h-8 rounded-lg border px-3 text-xs font-medium transition-colors ${
                range === r
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-line bg-surface2 text-muted hover:text-ink"
              }`}
            >
              1–{r}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="guess" className="text-xs text-muted">
          Your guess
        </label>
        <input
          id="guess"
          type="number"
          min={1}
          max={range}
          value={guess}
          disabled={busy}
          onChange={(e) =>
            setGuess(Math.max(1, Math.min(range, Number(e.target.value) || 1)))
          }
          className="h-9 w-24 rounded-lg border border-line bg-surface2 px-2 text-sm text-ink"
        />
      </div>

      {answer !== null ? (
        <div className="rounded-xl border border-line bg-surface p-4 text-center">
          <div className="text-[10px] uppercase tracking-widest text-muted">
            The number was
          </div>
          <div className="text-3xl font-semibold text-coin">{answer}</div>
        </div>
      ) : null}

      <GameButton full size="lg" onClick={playGuess} disabled={!flow.canAfford || busy}>
        {busy ? "Revealing…" : "Play"}
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
