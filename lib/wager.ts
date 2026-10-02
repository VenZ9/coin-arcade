/**
 * Central wager rules — the single source of truth for every bet in the arcade.
 *
 * All 38 games across all 12 engines read their wager through `useGameFlow()`
 * and render the shared `<WagerPicker>`, so the bounds, the validation and the
 * quick-adjust maths below apply everywhere. Nothing here is per-game, and no
 * game implements its own betting logic.
 *
 * Coins are purely fictional: there is no deposit, withdrawal or cash-out path
 * anywhere in this codebase.
 */

/** The smallest legal wager, in whole Coins. */
export const MIN_WAGER = 1;

/** The wager a fresh save starts from, before a saved value is restored. */
export const DEFAULT_WAGER = 10;

/** Preset chips offered next to the wager field. */
export const WAGER_PRESETS = [10, 50, 100, 500] as const;

/** How far the -10 / +10 buttons move the wager. */
export const WAGER_STEP = 10;

/** Highest wager that could be digit-typed (keeps the field sane). */
export const MAX_WAGER_DIGITS = 9;

export interface WagerValidation {
  ok: boolean;
  error: string | null;
}

/**
 * Snap a raw number to something storable and playable: whole Coins, at least
 * MIN_WAGER. Used when settling a round so a stake can never be fractional,
 * negative or NaN.
 */
export function clampWager(value: number): number {
  if (!Number.isFinite(value)) return MIN_WAGER;
  return Math.max(MIN_WAGER, Math.floor(value));
}

/**
 * Full validity check for the currently entered wager, including the balance
 * ceiling. Returns a human-readable reason when the wager is not playable.
 */
export function validateWager(value: number, coins: number): WagerValidation {
  if (!Number.isFinite(value)) {
    return { ok: false, error: "Enter a whole number of Coins." };
  }
  if (!Number.isInteger(value)) {
    return { ok: false, error: "Wagers must be whole Coins — no fractions." };
  }
  if (value < MIN_WAGER) {
    return { ok: false, error: `Enter at least ${MIN_WAGER} Coin.` };
  }
  const balance = Math.max(0, Math.floor(coins));
  if (value > balance) {
    return {
      ok: false,
      error: `That's more than your balance of ${balance.toLocaleString("en-US")} Coins.`,
    };
  }
  return { ok: true, error: null };
}

/** The largest wager the player could place right now. */
export function maxWager(coins: number): number {
  return Math.max(MIN_WAGER, Math.floor(Number.isFinite(coins) ? Math.max(0, coins) : 0));
}

/** Move the wager by `delta`, clamped to [MIN_WAGER, balance]. */
export function stepWager(current: number, delta: number, coins: number): number {
  const base = current < MIN_WAGER ? MIN_WAGER : Math.floor(current);
  return Math.min(Math.max(MIN_WAGER, base + delta), maxWager(coins));
}

/** Halve the wager, clamped to [MIN_WAGER, balance]. */
export function halfWager(current: number, coins: number): number {
  const base = current < MIN_WAGER ? MIN_WAGER : Math.floor(current);
  return Math.min(Math.max(MIN_WAGER, Math.floor(base / 2)), maxWager(coins));
}

/** Double the wager, clamped to [MIN_WAGER, balance]. */
export function doubleWager(current: number, coins: number): number {
  const base = current < MIN_WAGER ? MIN_WAGER : Math.floor(current);
  return Math.min(Math.max(MIN_WAGER, base * 2), maxWager(coins));
}

/** Everything the player can currently afford. */
export function allInWager(coins: number): number {
  return maxWager(coins);
}

/** True when the balance cannot even cover the minimum wager. */
export function isBroke(coins: number): boolean {
  return Math.max(0, Math.floor(Number.isFinite(coins) ? coins : 0)) < MIN_WAGER;
}
