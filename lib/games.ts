import type { Category } from "./types";

export type EngineId =
  | "pick"
  | "highcard"
  | "dice"
  | "wheel"
  | "slots"
  | "blackjack"
  | "plinko"
  | "multiplier"
  | "grid"
  | "number"
  | "scratch"
  | "chest";

export interface GameConfig {
  id: string;
  name: string;
  category: Category;
  description: string;
  icon: string;
  engine: EngineId;
  rules: string;
  /** Engine-specific tuning. Every engine has safe defaults. */
  options?: Record<string, unknown>;
  featured?: boolean;
}

export const CATEGORY_META: Record<
  Category,
  { label: string; blurb: string; icon: string }
> = {
  chance: { label: "Chance", blurb: "Pick a side and see what happens.", icon: "🎲" },
  risk: { label: "Risk", blurb: "Push your luck before it runs out.", icon: "🚀" },
  rewards: { label: "Rewards", blurb: "Open things. Find things.", icon: "🎁" },
  prediction: { label: "Prediction", blurb: "Guess the number, take the coins.", icon: "🔢" },
  choice: { label: "Choice", blurb: "One pick. One outcome.", icon: "🗺️" },
};

export const CATEGORY_ORDER: Category[] = [
  "chance",
  "risk",
  "rewards",
  "prediction",
  "choice",
];

export const GAMES: GameConfig[] = [
  // ── CHANCE ────────────────────────────────────────────────────────────────
  {
    id: "coin-flip",
    name: "Coin Flip",
    category: "chance",
    description: "Call it in the air.",
    icon: "🪙",
    engine: "pick",
    rules: "Choose Heads or Tails, then flip. A correct call pays 1.9× your wager.",
    options: { choices: ["Heads", "Tails"], correct: 0, multiplier: 1.9, visual: "coin" },
    featured: true,
  },
  {
    id: "high-card",
    name: "High Card",
    category: "chance",
    description: "Beat the dealer's card.",
    icon: "🃏",
    engine: "highcard",
    rules: "You and the dealer each draw a card. Higher card wins; a tie pushes your wager back.",
    options: { multiplier: 1.9 },
    featured: true,
  },
  {
    id: "dice-roll",
    name: "Dice Roll",
    category: "chance",
    description: "Over or under seven.",
    icon: "🎲",
    engine: "dice",
    rules: "Two dice are rolled. Call Over 7, Under 7, or Exactly 7 for a bigger payout.",
    options: { dice: 2, sides: 6 },
    featured: true,
  },
  {
    id: "lucky-wheel",
    name: "Lucky Wheel",
    category: "chance",
    description: "Spin for a multiplier.",
    icon: "🎡",
    engine: "wheel",
    rules: "Spin the wheel and land on a multiplier. Most segments pay, a few pay nothing.",
    options: {
      segments: [0, 1.5, 0, 2, 0, 1.5, 0, 3, 0, 1.5, 0, 2, 0, 1.5, 0, 5],
    },
    featured: true,
  },
  {
    id: "roulette",
    name: "Roulette",
    category: "chance",
    description: "Red, black, or a single number.",
    icon: "🔴",
    engine: "wheel",
    rules: "Bet on Red, Black, or a single number. Colour pays 1.9×, a number pays 30×.",
    options: { mode: "roulette" },
  },
  {
    id: "slots",
    name: "Slots",
    category: "chance",
    description: "Three reels, one spin.",
    icon: "🎰",
    engine: "slots",
    rules: "Spin three reels. Three of a kind pays big, two of a kind pays a little.",
    options: { reels: 3, symbols: ["🍒", "🍋", "🔔", "⭐", "💎", "7️⃣"] },
    featured: true,
  },
  {
    id: "blackjack-21",
    name: "21",
    category: "chance",
    description: "Get close to 21 without busting.",
    icon: "♠️",
    engine: "blackjack",
    rules: "Draw cards to beat the dealer without going over 21. A natural 21 pays 2.4×.",
    options: { target: 21 },
  },
  {
    id: "plinko",
    name: "Plinko",
    category: "chance",
    description: "Drop a ball, take the slot.",
    icon: "🔻",
    engine: "plinko",
    rules: "Choose a drop position and watch the ball fall. Centre slots pay least, edges pay most.",
    options: { rows: 8, slots: 9 },
  },
  {
    id: "color-match",
    name: "Color Match",
    category: "chance",
    description: "Name the colour that lands.",
    icon: "🎨",
    engine: "pick",
    rules: "Pick one of four colours. A correct pick pays 3.7× your wager.",
    options: {
      choices: ["Red", "Blue", "Green", "Yellow"],
      correct: 0,
      multiplier: 3.7,
      visual: "color",
    },
  },
  {
    id: "dice-duel",
    name: "Dice Duel",
    category: "chance",
    description: "Your die against theirs.",
    icon: "⚔️",
    engine: "dice",
    rules: "You and the dealer each roll one die. Higher roll wins; a tie pushes.",
    options: { dice: 1, sides: 6, duel: true },
  },
  {
    id: "dice-poker",
    name: "Dice Poker",
    category: "chance",
    description: "Roll a hand, score the pattern.",
    icon: "🀄",
    engine: "dice",
    rules: "Roll five dice. Five of a kind pays 20×, four 8×, a full house 4×, three 2×, a pair 1.2×.",
    options: { dice: 5, sides: 6, poker: true },
  },
  {
    id: "war",
    name: "War",
    category: "chance",
    description: "Highest card takes it.",
    icon: "🎴",
    engine: "highcard",
    rules: "Draw against the dealer. Win and you double; tie and you push.",
    options: { multiplier: 2 },
  },
  {
    id: "red-or-black",
    name: "Red or Black",
    category: "chance",
    description: "Two colours, one card.",
    icon: "🟥",
    engine: "pick",
    rules: "Call the colour of the next card. Correct pays 1.9×.",
    options: { choices: ["Red", "Black"], correct: 0, multiplier: 1.9, visual: "color" },
  },
  {
    id: "odd-or-even",
    name: "Odd or Even",
    category: "chance",
    description: "Parity of the roll.",
    icon: "➗",
    engine: "pick",
    rules: "Call whether the total will be odd or even. Correct pays 1.9×.",
    options: { choices: ["Odd", "Even"], correct: 0, multiplier: 1.9, visual: "number" },
  },
  {
    id: "three-cups",
    name: "Three Cups",
    category: "chance",
    description: "Follow the ball.",
    icon: "🥤",
    engine: "pick",
    rules: "The ball hides under one of three cups. Pick right and triple your wager.",
    options: { choices: ["Cup 1", "Cup 2", "Cup 3"], correct: 0, multiplier: 2.8, visual: "cup" },
  },

  // ── RISK ──────────────────────────────────────────────────────────────────
  {
    id: "crash",
    name: "Crash",
    category: "risk",
    description: "Cash out before it busts.",
    icon: "📉",
    engine: "multiplier",
    rules: "The multiplier climbs from 1.00×. Collect any time — but if it crashes first, you lose the wager.",
    options: { bustAt: 1.0, growth: 0.06, tickMs: 120 },
    featured: true,
  },
  {
    id: "mines",
    name: "Mines",
    category: "risk",
    description: "Reveal tiles, avoid the mines.",
    icon: "💣",
    engine: "grid",
    rules: "Reveal safe tiles to grow your multiplier. Hit a mine and the round ends. Collect whenever you like.",
    options: { size: 5, mines: 3 },
    featured: true,
  },
  {
    id: "tower-climb",
    name: "Tower Climb",
    category: "risk",
    description: "Climb floors, dodge the trap.",
    icon: "🗼",
    engine: "multiplier",
    rules: "Each floor hides one trap among three doors. Climb higher for a bigger multiplier, or collect and stop.",
    options: { mode: "tower", floors: 8 },
  },
  {
    id: "risk-ladder",
    name: "Risk Ladder",
    category: "risk",
    description: "Step up, or step off.",
    icon: "🪜",
    engine: "multiplier",
    rules: "Every rung raises the multiplier and the risk. Collect at any rung to bank your winnings.",
    options: { mode: "ladder", rungs: 10 },
  },
  {
    id: "rocket-launch",
    name: "Rocket Launch",
    category: "risk",
    description: "Eject before the fuel runs out.",
    icon: "🚀",
    engine: "multiplier",
    rules: "The rocket climbs and the multiplier rises. Eject in time, or lose the wager on a failed launch.",
    options: { mode: "rocket", growth: 0.08, tickMs: 130 },
  },
  {
    id: "bomb-finder",
    name: "Bomb Finder",
    category: "risk",
    description: "Dig for coins, not bombs.",
    icon: "🧨",
    engine: "grid",
    rules: "A grid hides coins and bombs. Reveal coins to build your multiplier; a bomb ends the round.",
    options: { size: 4, mines: 2 },
  },
  {
    id: "dice-ladder",
    name: "Dice Ladder",
    category: "risk",
    description: "Roll above the bar, again and again.",
    icon: "📊",
    engine: "multiplier",
    rules: "Each rung needs a higher roll. Clear it to climb; fail and the round ends.",
    options: { mode: "diceLadder", rungs: 8 },
  },

  // ── REWARDS ───────────────────────────────────────────────────────────────
  {
    id: "treasure-chests",
    name: "Treasure Chests",
    category: "rewards",
    description: "One chest holds the prize.",
    icon: "🧰",
    engine: "chest",
    rules: "Pick a chest. One holds a big payout, the others hold smaller ones — every chest pays something.",
    options: { chests: 3, payouts: [3, 1.2, 0.4] },
    featured: true,
  },
  {
    id: "scratch-card",
    name: "Scratch Card",
    category: "rewards",
    description: "Scratch to reveal three symbols.",
    icon: "🎫",
    engine: "scratch",
    rules: "Scratch three panels. Match all three for 10×, two for 2×, one for your wager back.",
    options: { panels: 3 },
  },
  {
    id: "mystery-box",
    name: "Mystery Box",
    category: "rewards",
    description: "Open it and find out.",
    icon: "📦",
    engine: "chest",
    rules: "Open the box for a random payout — sometimes coins, sometimes a collectible item.",
    options: { chests: 1, payouts: [2.5], itemChance: 0.25 },
  },
  {
    id: "treasure-wheel",
    name: "Treasure Wheel",
    category: "rewards",
    description: "A wheel of prizes.",
    icon: "🎯",
    engine: "wheel",
    rules: "Spin for a prize. Segments range from nothing up to a 6× payout.",
    options: { segments: [0, 1.2, 0, 2, 0, 1.5, 0, 6, 0, 1.2, 0, 2, 0, 1.5, 0, 3] },
  },
  {
    id: "jackpot-draw",
    name: "Jackpot Draw",
    category: "rewards",
    description: "Draw for the big one.",
    icon: "🎟️",
    engine: "pick",
    rules: "Draw one of five tickets. Four pay small, one pays a 12× jackpot.",
    options: {
      choices: ["Ticket A", "Ticket B", "Ticket C", "Ticket D", "Ticket E"],
      correct: 0,
      multiplier: 12,
      visual: "ticket",
      consolation: 0.2,
    },
  },
  {
    id: "pick-a-box",
    name: "Pick-a-Box",
    category: "rewards",
    description: "Six boxes, one prize.",
    icon: "🎁",
    engine: "pick",
    rules: "Pick one of six boxes. One holds a 5× prize, the rest pay a small consolation.",
    options: {
      choices: ["Box 1", "Box 2", "Box 3", "Box 4", "Box 5", "Box 6"],
      correct: 0,
      multiplier: 5,
      visual: "box",
      consolation: 0.3,
    },
  },
  {
    id: "mystery-doors",
    name: "Mystery Doors",
    category: "rewards",
    description: "Three doors, unknown prizes.",
    icon: "🚪",
    engine: "pick",
    rules: "Open one of three doors. Prizes are 4×, 1.5×, or a small consolation.",
    options: {
      choices: ["Door 1", "Door 2", "Door 3"],
      correct: 0,
      multiplier: 4,
      visual: "door",
      consolation: 0.4,
    },
  },

  // ── PREDICTION ────────────────────────────────────────────────────────────
  {
    id: "number-guess",
    name: "Number Guess",
    category: "prediction",
    description: "Guess the number exactly.",
    icon: "🔢",
    engine: "number",
    rules: "Pick a range, then guess the exact number. Narrower ranges pay more.",
    options: { ranges: [10, 25, 50, 100] },
    featured: true,
  },
  {
    id: "higher-or-lower",
    name: "Higher or Lower",
    category: "prediction",
    description: "Will the next card be higher?",
    icon: "⬆️",
    engine: "number",
    rules: "A card is shown. Call whether the next one is higher or lower. Correct pays 1.9×.",
    options: { mode: "higherLower" },
  },
  {
    id: "lucky-number",
    name: "Lucky Number",
    category: "prediction",
    description: "One number out of ten.",
    icon: "🍀",
    engine: "pick",
    rules: "Pick a number from 1 to 10. Hit it exactly and win 8× your wager.",
    options: {
      choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      correct: 0,
      multiplier: 8,
      visual: "number",
    },
  },
  {
    id: "target-number",
    name: "Target Number",
    category: "prediction",
    description: "Land on the target.",
    icon: "🎯",
    engine: "pick",
    rules: "A target number is drawn from 1 to 6. Pick it exactly to win 5×.",
    options: {
      choices: ["1", "2", "3", "4", "5", "6"],
      correct: 0,
      multiplier: 5,
      visual: "number",
    },
  },
  {
    id: "number-grid",
    name: "Number Grid",
    category: "prediction",
    description: "Find the hidden number.",
    icon: "🔟",
    engine: "grid",
    rules: "A number hides in a 4×4 grid. Reveal tiles to narrow it down, then lock in your guess.",
    options: { size: 4, mines: 0, mode: "hunt" },
  },

  // ── CHOICE ────────────────────────────────────────────────────────────────
  {
    id: "gem-hunt",
    name: "Gem Hunt",
    category: "choice",
    description: "One gem among the rocks.",
    icon: "💎",
    engine: "pick",
    rules: "Pick one of five spots. One hides a gem worth 4.5×, the rest pay a small consolation.",
    options: {
      choices: ["Spot 1", "Spot 2", "Spot 3", "Spot 4", "Spot 5"],
      correct: 0,
      multiplier: 4.5,
      visual: "gem",
      consolation: 0.25,
    },
  },
  {
    id: "treasure-map",
    name: "Treasure Map",
    category: "choice",
    description: "Follow the right path.",
    icon: "🗺️",
    engine: "pick",
    rules: "Choose one of four routes. The right route leads to a 3.6× payout.",
    options: {
      choices: ["North", "East", "South", "West"],
      correct: 0,
      multiplier: 3.6,
      visual: "map",
      consolation: 0.2,
    },
  },
  {
    id: "door-pick",
    name: "Door Pick",
    category: "choice",
    description: "Two doors, one prize.",
    icon: "🚪",
    engine: "pick",
    rules: "Pick one of two doors. One pays 1.9×, the other pays nothing.",
    options: { choices: ["Left", "Right"], correct: 0, multiplier: 1.9, visual: "door" },
  },
  {
    id: "safe-cracker",
    name: "Safe Cracker",
    category: "choice",
    description: "Crack the combination.",
    icon: "🔐",
    engine: "pick",
    rules: "Pick one of four dial positions. The right one opens the safe for 3.6×.",
    options: {
      choices: ["A", "B", "C", "D"],
      correct: 0,
      multiplier: 3.6,
      visual: "safe",
      consolation: 0.15,
    },
  },
];

export const GAME_MAP: Record<string, GameConfig> = Object.fromEntries(
  GAMES.map((g) => [g.id, g])
);

export function getGame(id: string): GameConfig | undefined {
  return GAME_MAP[id];
}

export function gamesByCategory(c: Category): GameConfig[] {
  return GAMES.filter((g) => g.category === c);
}

export const FEATURED_GAMES = GAMES.filter((g) => g.featured);
