import type { SaveState } from "./types";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** Returns true when the achievement should unlock. */
  test: (s: SaveState) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_play",
    name: "First Spin",
    description: "Play your first game.",
    icon: "🎮",
    test: (s) => s.stats.totalGames >= 1,
  },
  {
    id: "first_win",
    name: "Beginner's Luck",
    description: "Win a game.",
    icon: "🍀",
    test: (s) => s.stats.wins >= 1,
  },
  {
    id: "ten_games",
    name: "Warmed Up",
    description: "Play 10 games.",
    icon: "🔥",
    test: (s) => s.stats.totalGames >= 10,
  },
  {
    id: "fifty_games",
    name: "Regular",
    description: "Play 50 games.",
    icon: "🎯",
    test: (s) => s.stats.totalGames >= 50,
  },
  {
    id: "hundred_games",
    name: "Arcade Fixture",
    description: "Play 100 games.",
    icon: "🏆",
    test: (s) => s.stats.totalGames >= 100,
  },
  {
    id: "ten_wins",
    name: "On a Roll",
    description: "Win 10 games.",
    icon: "📈",
    test: (s) => s.stats.wins >= 10,
  },
  {
    id: "fifty_wins",
    name: "Sharp Shooter",
    description: "Win 50 games.",
    icon: "🎖️",
    test: (s) => s.stats.wins >= 50,
  },
  {
    id: "level_5",
    name: "Getting Somewhere",
    description: "Reach level 5.",
    icon: "⭐",
    test: (s) => s.level >= 5,
  },
  {
    id: "level_10",
    name: "Double Digits",
    description: "Reach level 10.",
    icon: "🌟",
    test: (s) => s.level >= 10,
  },
  {
    id: "level_25",
    name: "Veteran",
    description: "Reach level 25.",
    icon: "💫",
    test: (s) => s.level >= 25,
  },
  {
    id: "rich_1k",
    name: "Pocket Change",
    description: "Hold 1,000 Coins at once.",
    icon: "🪙",
    test: (s) => s.coins >= 1000,
  },
  {
    id: "rich_10k",
    name: "Coin Collector",
    description: "Hold 10,000 Coins at once.",
    icon: "💰",
    test: (s) => s.coins >= 10000,
  },
  {
    id: "rich_100k",
    name: "Vault Keeper",
    description: "Hold 100,000 Coins at once.",
    icon: "🏦",
    test: (s) => s.coins >= 100000,
  },
  {
    id: "big_win",
    name: "Big Spender",
    description: "Win 5,000 Coins in a single game.",
    icon: "💥",
    test: (s) => s.stats.bestWin >= 5000,
  },
  {
    id: "streak_3",
    name: "Habit Forming",
    description: "Claim a 3-day daily streak.",
    icon: "📅",
    test: (s) => s.daily.streak >= 3,
  },
  {
    id: "streak_7",
    name: "Week Strong",
    description: "Claim a 7-day daily streak.",
    icon: "🗓️",
    test: (s) => s.daily.streak >= 7,
  },
  {
    id: "collector_5",
    name: "Curator",
    description: "Collect 5 different items.",
    icon: "📦",
    test: (s) => s.inventory.length >= 5,
  },
  {
    id: "collector_12",
    name: "Hoarder",
    description: "Collect 12 different items.",
    icon: "🗃️",
    test: (s) => s.inventory.length >= 12,
  },
  {
    id: "collector_all",
    name: "Completionist",
    description: "Collect every item in the arcade.",
    icon: "👑",
    test: (s) => s.inventory.length >= 22,
  },
  {
    id: "explorer",
    name: "Explorer",
    description: "Play 10 different games.",
    icon: "🧭",
    test: (s) => Object.keys(s.stats.perGame).length >= 10,
  },
  {
    id: "all_rounder",
    name: "All-Rounder",
    description: "Play 25 different games.",
    icon: "🌐",
    test: (s) => Object.keys(s.stats.perGame).length >= 25,
  },
  {
    id: "high_roller",
    name: "High Roller",
    description: "Wager 1,000 Coins in a single game.",
    icon: "🎰",
    test: (s) => s.history.some((h) => h.wager >= 1000),
  },
];

export const ACHIEVEMENT_MAP: Record<string, Achievement> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a])
);

export const TOTAL_ACHIEVEMENTS = ACHIEVEMENTS.length;
