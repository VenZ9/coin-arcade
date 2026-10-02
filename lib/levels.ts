export const MAX_LEVEL = 100;

/** XP required to advance FROM `level` to `level + 1`. */
export function xpToNext(level: number): number {
  if (level >= MAX_LEVEL) return Infinity;
  return 100 + (level - 1) * 50;
}

/** Total cumulative XP required to reach `level` (level 1 = 0 XP). */
export function totalXpForLevel(level: number): number {
  let sum = 0;
  for (let l = 1; l < level; l++) sum += xpToNext(l);
  return sum;
}

/** Derive the level from a raw XP total. */
export function levelFromXp(xp: number): number {
  let level = 1;
  let remaining = Math.max(0, Math.floor(xp));
  while (level < MAX_LEVEL && remaining >= xpToNext(level)) {
    remaining -= xpToNext(level);
    level++;
  }
  return level;
}

export interface XpProgress {
  level: number;
  into: number;
  need: number;
  pct: number;
  maxed: boolean;
}

export function xpProgress(xp: number): XpProgress {
  const level = levelFromXp(xp);
  const base = totalXpForLevel(level);
  const into = Math.max(0, Math.floor(xp) - base);
  const need = xpToNext(level);
  if (level >= MAX_LEVEL) {
    return { level, into, need: 0, pct: 100, maxed: true };
  }
  return {
    level,
    into,
    need,
    pct: Math.min(100, Math.round((into / need) * 100)),
    maxed: false,
  };
}

/** XP awarded for a play, scaled by wager and outcome. */
export function xpForPlay(wager: number, won: boolean): number {
  const base = 5 + Math.floor(Math.sqrt(Math.max(0, wager)) * 2);
  return won ? base + 5 : base;
}
