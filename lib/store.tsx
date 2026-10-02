"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  GameResult,
  InventoryEntry,
  PlayOutcome,
  SaveState,
  Settings,
} from "./types";
import { levelFromXp, xpForPlay, xpProgress, type XpProgress } from "./levels";
import { ACHIEVEMENTS } from "./achievements";
import { DEFAULT_WAGER, MIN_WAGER } from "./wager";

const STORAGE_KEY = "coin-arcade:v1";
const SAVE_VERSION = 1;
const STARTING_COINS = 1000;
const HISTORY_LIMIT = 100;

export const AVATARS = ["🦊", "🐼", "🐙", "🦉", "🐸", "🦄", "🐳", "🦖", "🐝", "🦋", "🐧", "🦁"];

export function defaultState(): SaveState {
  return {
    version: SAVE_VERSION,
    username: "Player",
    avatar: AVATARS[0],
    coins: STARTING_COINS,
    xp: 0,
    level: 1,
    inventory: [],
    stats: {
      totalGames: 0,
      wins: 0,
      losses: 0,
      totalWagered: 0,
      totalWon: 0,
      bestWin: 0,
      perGame: {},
    },
    achievements: [],
    daily: { lastClaim: null, streak: 0 },
    history: [],
    settings: {
      sound: true,
      haptics: true,
      reduceMotion: false,
      lastWager: DEFAULT_WAGER,
    },
    createdAt: Date.now(),
  };
}

/** Coins granted for a daily claim, scaled by the current streak. */
export function dailyRewardFor(streak: number): number {
  return 100 + Math.min(Math.max(streak, 0), 6) * 50;
}

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function canClaimDaily(s: SaveState): boolean {
  if (s.daily.lastClaim === null) return true;
  return startOfDay(Date.now()) > startOfDay(s.daily.lastClaim);
}

/** Streak that WOULD apply if the player claims right now. */
export function nextStreak(s: SaveState): number {
  if (s.daily.lastClaim === null) return 1;
  const today = startOfDay(Date.now());
  const last = startOfDay(s.daily.lastClaim);
  const dayMs = 86_400_000;
  if (today - last === dayMs) return s.daily.streak + 1;
  if (today === last) return s.daily.streak;
  return 1;
}

function addItemTo(
  inventory: InventoryEntry[],
  itemId: string
): InventoryEntry[] {
  const existing = inventory.find((e) => e.itemId === itemId);
  if (existing) {
    return inventory.map((e) =>
      e.itemId === itemId ? { ...e, quantity: e.quantity + 1 } : e
    );
  }
  return [...inventory, { itemId, quantity: 1, firstObtained: Date.now() }];
}

/** Recompute level and unlock any newly-earned achievements. */
function reconcile(s: SaveState): { state: SaveState; unlocked: string[] } {
  const level = levelFromXp(s.xp);
  const withLevel: SaveState = { ...s, level };
  const unlocked: string[] = [];
  for (const a of ACHIEVEMENTS) {
    if (!withLevel.achievements.includes(a.id) && a.test(withLevel)) {
      unlocked.push(a.id);
    }
  }
  if (unlocked.length === 0) return { state: withLevel, unlocked };
  return {
    state: { ...withLevel, achievements: [...withLevel.achievements, ...unlocked] },
    unlocked,
  };
}

function sanitize(raw: unknown): SaveState {
  const base = defaultState();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<SaveState>;
  const num = (v: unknown, d: number) =>
    typeof v === "number" && Number.isFinite(v) ? v : d;
  return {
    version: SAVE_VERSION,
    username:
      typeof r.username === "string" && r.username.trim()
        ? r.username.slice(0, 20)
        : base.username,
    avatar: typeof r.avatar === "string" ? r.avatar : base.avatar,
    coins: Math.max(0, num(r.coins, base.coins)),
    xp: Math.max(0, num(r.xp, 0)),
    level: 1,
    inventory: Array.isArray(r.inventory)
      ? r.inventory.filter(
          (e): e is InventoryEntry =>
            !!e && typeof e.itemId === "string" && typeof e.quantity === "number"
        )
      : [],
    stats: {
      totalGames: Math.max(0, num(r.stats?.totalGames, 0)),
      wins: Math.max(0, num(r.stats?.wins, 0)),
      losses: Math.max(0, num(r.stats?.losses, 0)),
      totalWagered: Math.max(0, num(r.stats?.totalWagered, 0)),
      totalWon: Math.max(0, num(r.stats?.totalWon, 0)),
      bestWin: Math.max(0, num(r.stats?.bestWin, 0)),
      perGame:
        r.stats?.perGame && typeof r.stats.perGame === "object"
          ? r.stats.perGame
          : {},
    },
    achievements: Array.isArray(r.achievements)
      ? r.achievements.filter((a): a is string => typeof a === "string")
      : [],
    daily: {
      lastClaim:
        typeof r.daily?.lastClaim === "number" ? r.daily.lastClaim : null,
      streak: Math.max(0, num(r.daily?.streak, 0)),
    },
    history: Array.isArray(r.history)
      ? r.history.filter((h): h is GameResult => !!h && typeof h.gameId === "string")
      : [],
    settings: {
      sound: r.settings?.sound !== false,
      haptics: r.settings?.haptics !== false,
      reduceMotion: r.settings?.reduceMotion === true,
      lastWager: Math.max(
        MIN_WAGER,
        Math.floor(num(r.settings?.lastWager, DEFAULT_WAGER))
      ),
    },
    createdAt: num(r.createdAt, Date.now()),
  };
}

interface ArcadeContextValue {
  state: SaveState;
  hydrated: boolean;
  progress: XpProgress;
  pendingUnlocks: string[];
  dismissUnlock: (id: string) => void;
  play: (gameId: string, wager: number, outcome: PlayOutcome) => void;
  claimDaily: () => number;
  grantItem: (itemId: string) => void;
  setUsername: (name: string) => void;
  setAvatar: (avatar: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetProgress: () => void;
}

const ArcadeContext = createContext<ArcadeContextValue | null>(null);

export function ArcadeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SaveState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [pendingUnlocks, setPendingUnlocks] = useState<string[]>([]);
  const firstRun = useRef(true);

  // Hydrate from localStorage on mount (client only).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = sanitize(JSON.parse(raw));
        setState(reconcile(parsed).state);
      }
    } catch {
      // Corrupt or unavailable storage: fall back to a fresh save.
    }
    setHydrated(true);
  }, []);

  // Persist on every change, once hydrated.
  useEffect(() => {
    if (!hydrated) return;
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full or blocked: keep playing in memory.
    }
  }, [state, hydrated]);

  const commit = useCallback(
    (updater: (prev: SaveState) => SaveState) => {
      setState((prev) => {
        const { state: next, unlocked } = reconcile(updater(prev));
        if (unlocked.length) setPendingUnlocks((p) => [...p, ...unlocked]);
        return next;
      });
    },
    []
  );

  const play = useCallback(
    (gameId: string, wager: number, outcome: PlayOutcome) => {
      commit((prev) => {
        const stake = Math.max(0, Math.floor(wager));
        const payout = Math.max(0, Math.floor(outcome.payout));
        const net = payout - stake;
        const push = outcome.push === true;
        const won = outcome.won && !push;
        const xp = xpForPlay(stake, won);
        const result: GameResult = {
          gameId,
          wager: stake,
          payout,
          net,
          xp,
          won,
          at: Date.now(),
          detail: outcome.detail,
        };
        const prevStat = prev.stats.perGame[gameId] ?? { played: 0, won: 0 };
        return {
          ...prev,
          coins: Math.max(0, prev.coins - stake + payout),
          xp: prev.xp + xp,
          inventory: outcome.itemId
            ? addItemTo(prev.inventory, outcome.itemId)
            : prev.inventory,
          stats: {
            totalGames: prev.stats.totalGames + 1,
            wins: prev.stats.wins + (won ? 1 : 0),
            losses: prev.stats.losses + (won || push ? 0 : 1),
            totalWagered: prev.stats.totalWagered + stake,
            totalWon: prev.stats.totalWon + payout,
            bestWin: Math.max(prev.stats.bestWin, net),
            perGame: {
              ...prev.stats.perGame,
              [gameId]: {
                played: prevStat.played + 1,
                won: prevStat.won + (won ? 1 : 0),
              },
            },
          },
          history: [result, ...prev.history].slice(0, HISTORY_LIMIT),
        };
      });
    },
    [commit]
  );

  const claimDaily = useCallback((): number => {
    let granted = 0;
    commit((prev) => {
      if (!canClaimDaily(prev)) return prev;
      const streak = nextStreak(prev);
      granted = dailyRewardFor(streak);
      return {
        ...prev,
        coins: prev.coins + granted,
        xp: prev.xp + 25,
        daily: { lastClaim: Date.now(), streak },
      };
    });
    return granted;
  }, [commit]);

  const grantItem = useCallback(
    (itemId: string) => {
      commit((prev) => ({
        ...prev,
        inventory: addItemTo(prev.inventory, itemId),
      }));
    },
    [commit]
  );

  const setUsername = useCallback(
    (name: string) => {
      const clean = name.trim().slice(0, 20);
      commit((prev) => ({ ...prev, username: clean || "Player" }));
    },
    [commit]
  );

  const setAvatar = useCallback(
    (avatar: string) => commit((prev) => ({ ...prev, avatar })),
    [commit]
  );

  const updateSettings = useCallback(
    (patch: Partial<Settings>) =>
      commit((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } })),
    [commit]
  );

  const resetProgress = useCallback(() => {
    setState(defaultState());
    setPendingUnlocks([]);
  }, []);

  const dismissUnlock = useCallback((id: string) => {
    setPendingUnlocks((p) => p.filter((x) => x !== id));
  }, []);

  const progress = useMemo(() => xpProgress(state.xp), [state.xp]);

  const value = useMemo<ArcadeContextValue>(
    () => ({
      state,
      hydrated,
      progress,
      pendingUnlocks,
      dismissUnlock,
      play,
      claimDaily,
      grantItem,
      setUsername,
      setAvatar,
      updateSettings,
      resetProgress,
    }),
    [
      state,
      hydrated,
      progress,
      pendingUnlocks,
      dismissUnlock,
      play,
      claimDaily,
      grantItem,
      setUsername,
      setAvatar,
      updateSettings,
      resetProgress,
    ]
  );

  return <ArcadeContext.Provider value={value}>{children}</ArcadeContext.Provider>;
}

export function useArcade(): ArcadeContextValue {
  const ctx = useContext(ArcadeContext);
  if (!ctx) throw new Error("useArcade must be used inside <ArcadeProvider>");
  return ctx;
}
