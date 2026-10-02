import type { GameConfig } from "@/lib/games";

export interface EngineProps {
  game: GameConfig;
}

/** Narrow an unknown option to a number with a fallback. */
export function optNum(
  o: Record<string, unknown> | undefined,
  key: string,
  fallback: number
): number {
  const v = o?.[key];
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

export function optStr(
  o: Record<string, unknown> | undefined,
  key: string,
  fallback: string
): string {
  const v = o?.[key];
  return typeof v === "string" ? v : fallback;
}

export function optBool(
  o: Record<string, unknown> | undefined,
  key: string,
  fallback = false
): boolean {
  const v = o?.[key];
  return typeof v === "boolean" ? v : fallback;
}

export function optArr<T>(
  o: Record<string, unknown> | undefined,
  key: string,
  fallback: T[]
): T[] {
  const v = o?.[key];
  return Array.isArray(v) ? (v as T[]) : fallback;
}
