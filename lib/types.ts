export type Rarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic";

export type Category = "chance" | "risk" | "rewards" | "prediction" | "choice";

export interface Item {
  id: string;
  name: string;
  icon: string;
  rarity: Rarity;
  description: string;
}

export interface InventoryEntry {
  itemId: string;
  quantity: number;
  firstObtained: number;
}

export interface GameResult {
  gameId: string;
  wager: number;
  payout: number;
  net: number;
  xp: number;
  won: boolean;
  at: number;
  detail?: string;
}

export interface GameStat {
  played: number;
  won: number;
}

export interface Stats {
  totalGames: number;
  wins: number;
  losses: number;
  totalWagered: number;
  totalWon: number;
  bestWin: number;
  perGame: Record<string, GameStat>;
}

export interface Settings {
  sound: boolean;
  haptics: boolean;
  reduceMotion: boolean;
}

export interface DailyState {
  lastClaim: number | null;
  streak: number;
}

export interface SaveState {
  version: number;
  username: string;
  avatar: string;
  coins: number;
  xp: number;
  level: number;
  inventory: InventoryEntry[];
  stats: Stats;
  achievements: string[];
  daily: DailyState;
  history: GameResult[];
  settings: Settings;
  createdAt: number;
}

export interface PlayOutcome {
  won: boolean;
  payout: number;
  detail?: string;
  itemId?: string;
  /** A tie/push: the wager is returned and the play counts as neither a win nor a loss. */
  push?: boolean;
}
