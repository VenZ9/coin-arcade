"use client";

import { useEffect, useId, useState } from "react";
import { useArcade } from "@/lib/store";
import { formatCoins } from "@/lib/rewards";
import {
  MAX_WAGER_DIGITS,
  MIN_WAGER,
  WAGER_PRESETS,
  WAGER_STEP,
  allInWager,
  doubleWager,
  halfWager,
  isBroke,
  stepWager,
  validateWager,
} from "@/lib/wager";

export interface WagerPickerProps {
  /** The committed wager, in whole Coins. */
  value: number;
  /** Commit a new wager. */
  onChange: (next: number) => void;
  /** Locked while a round is in flight. */
  disabled?: boolean;
}

const CHIP =
  "h-8 rounded-lg border border-line bg-surface2 px-2 text-[11px] font-medium tabular-nums text-muted transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40";
const CHIP_ACTIVE = "border-accent bg-accent/15 text-accent";

/**
 * The shared wager panel used by every game.
 *
 * Renders a custom amount field with quick-adjust controls and preset chips,
 * validates it through `lib/wager.ts`, and shows the reason inline. It reads
 * the balance from the central store, so all 38 games behave identically.
 */
export function WagerPicker({
  value,
  onChange,
  disabled = false,
}: WagerPickerProps) {
  const { state } = useArcade();
  const coins = state.coins;
  const [text, setText] = useState(() => String(value));
  const inputId = useId();
  const errorId = `${inputId}-error`;

  const { ok, error } = validateWager(value, coins);
  const broke = isBroke(coins);
  const locked = disabled;

  // Keep the field in step with the committed value (presets, restore, Half…).
  useEffect(() => {
    setText((prev) => {
      const prevNum = prev === "" ? 0 : Number(prev);
      return prevNum === value ? prev : String(value);
    });
  }, [value]);

  const type = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, "").slice(0, MAX_WAGER_DIGITS);
    setText(digits);
    onChange(digits === "" ? 0 : Number(digits));
  };

  const apply = (next: number) => {
    const safe = Math.max(MIN_WAGER, Math.floor(next));
    setText(String(safe));
    onChange(safe);
  };

  return (
    <div className="rounded-xl border border-line bg-surface p-3">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <label htmlFor={inputId} className="text-xs font-medium text-muted">
          Wager
        </label>
        <span className="text-[11px] tabular-nums text-muted">
          Balance {formatCoins(coins)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <span
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-coin"
          >
            🪙
          </span>
          <input
            id={inputId}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            spellCheck={false}
            value={text}
            disabled={locked}
            aria-invalid={!ok}
            aria-describedby={error ? errorId : undefined}
            onChange={(e) => type(e.target.value)}
            onBlur={() => {
              if (text === "") apply(value);
            }}
            className={`h-10 w-full rounded-lg border bg-surface2 pl-8 pr-3 text-sm tabular-nums text-ink outline-none transition-colors focus:border-accent disabled:cursor-not-allowed disabled:opacity-60 ${
              ok ? "border-line" : "border-bad/60"
            }`}
          />
        </div>
        <span className="shrink-0 text-xs text-muted">Coins</span>
      </div>

      <div className="mt-2 grid grid-cols-4 gap-1.5">
        <button
          type="button"
          disabled={locked || broke}
          onClick={() => apply(stepWager(value, -WAGER_STEP, coins))}
          className={`${CHIP} h-8 w-full`}
          aria-label={`Decrease wager by ${WAGER_STEP}`}
        >
          -{WAGER_STEP}
        </button>
        <button
          type="button"
          disabled={locked || broke}
          onClick={() => apply(stepWager(value, WAGER_STEP, coins))}
          className={`${CHIP} h-8 w-full`}
          aria-label={`Increase wager by ${WAGER_STEP}`}
        >
          +{WAGER_STEP}
        </button>
        <button
          type="button"
          disabled={locked || broke}
          onClick={() => apply(halfWager(value, coins))}
          className={`${CHIP} h-8 w-full`}
        >
          Half
        </button>
        <button
          type="button"
          disabled={locked || broke}
          onClick={() => apply(doubleWager(value, coins))}
          className={`${CHIP} h-8 w-full`}
        >
          Double
        </button>
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        {WAGER_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            disabled={locked || preset > coins}
            aria-pressed={value === preset}
            onClick={() => apply(preset)}
            className={`${CHIP} ${value === preset ? CHIP_ACTIVE : ""}`}
          >
            {formatCoins(preset)}
          </button>
        ))}
        <button
          type="button"
          disabled={locked || broke}
          aria-pressed={value === coins}
          onClick={() => apply(allInWager(coins))}
          className={`${CHIP} ${value === coins ? CHIP_ACTIVE : ""}`}
        >
          All in
        </button>
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-[11px] text-bad">
          {error}
        </p>
      ) : broke ? (
        <p className="mt-2 text-[11px] text-muted">
          Claim your daily reward to get back in.
        </p>
      ) : null}
    </div>
  );
}
