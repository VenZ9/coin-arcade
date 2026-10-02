import type { Rarity } from "./types";

/** Inclusive integer in [min, max]. */
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function chance(p: number): boolean {
  return Math.random() < p;
}

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const RARITY_ORDER: Rarity[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
];

export const RARITY_META: Record<
  Rarity,
  { label: string; text: string; border: string; bg: string; weight: number }
> = {
  common: {
    label: "Common",
    text: "text-slate-300",
    border: "border-slate-600/60",
    bg: "bg-slate-500/10",
    weight: 1000,
  },
  uncommon: {
    label: "Uncommon",
    text: "text-emerald-300",
    border: "border-emerald-600/50",
    bg: "bg-emerald-500/10",
    weight: 420,
  },
  rare: {
    label: "Rare",
    text: "text-sky-300",
    border: "border-sky-600/50",
    bg: "bg-sky-500/10",
    weight: 150,
  },
  epic: {
    label: "Epic",
    text: "text-violet-300",
    border: "border-violet-600/50",
    bg: "bg-violet-500/10",
    weight: 45,
  },
  legendary: {
    label: "Legendary",
    text: "text-amber-300",
    border: "border-amber-600/50",
    bg: "bg-amber-500/10",
    weight: 12,
  },
  mythic: {
    label: "Mythic",
    text: "text-rose-300",
    border: "border-rose-600/50",
    bg: "bg-rose-500/10",
    weight: 3,
  },
};

/** Weighted rarity roll. `luck` (0..1) nudges the odds toward rarer tiers. */
export function rollRarity(luck = 0): Rarity {
  const entries = RARITY_ORDER.map((r, i) => {
    const base = RARITY_META[r].weight;
    const boost = 1 + luck * i * 0.6;
    return { r, w: base * boost };
  });
  const total = entries.reduce((s, e) => s + e.w, 0);
  let roll = Math.random() * total;
  for (const e of entries) {
    roll -= e.w;
    if (roll <= 0) return e.r;
  }
  return "common";
}

/** Standard payout multiplier for a 1-in-`n` event, with a house edge. */
export function payoutFor(n: number, edge = 0.94): number {
  return Math.max(1, Math.round(n * edge * 100) / 100);
}

export function formatCoins(n: number): string {
  const v = Math.round(n);
  if (Math.abs(v) >= 1_000_000) return (v / 1_000_000).toFixed(2) + "M";
  if (Math.abs(v) >= 10_000) return (v / 1000).toFixed(1) + "k";
  return v.toLocaleString("en-US");
}
