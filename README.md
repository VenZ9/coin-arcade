# Coin Arcade

A mobile-first web arcade of short minigames, played with a **fictional in-app currency called Coins**.

Built with Next.js (App Router), TypeScript, Tailwind CSS and React. Deploys directly to Vercel — no custom server, no environment variables, no external APIs.

> **Coins are not money.** They are a purely virtual, in-app score with no real-world value. This app has **no deposits, withdrawals, cash-out, crypto, payment providers, or purchasable gambling mechanics**. Coins cannot be bought, sold, or exchanged for anything.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

Lint:

```bash
npm run lint
```

### Deploy to Vercel

Import the repository at [vercel.com/new](https://vercel.com/new) and deploy. The defaults are correct — no configuration or environment variables are required.

---

## Features

### Navigation
Four tabs, fixed to the bottom on mobile: **Home**, **Games**, **Inventory**, **Profile**.

### Home
Coin balance, level and XP bar, daily reward with streak tracking, recently played games, and featured games.

### Games
A searchable, category-filtered grid of **38 games** across five categories.

| Category | Games |
|---|---|
| **Chance** | Coin Flip, High Card, Dice Roll, Lucky Wheel, Roulette, Slots, 21 (Blackjack), Plinko, Color Match, Dice Duel, Dice Poker, War, Red or Black, Odd or Even, Three Cups |
| **Risk** | Crash, Mines, Tower Climb, Risk Ladder, Rocket Launch, Bomb Finder, Dice Ladder |
| **Rewards** | Treasure Chests, Scratch Card, Mystery Box, Treasure Wheel, Jackpot Draw, Pick-a-Box, Mystery Doors |
| **Prediction** | Number Guess, Higher or Lower, Lucky Number, Target Number, Number Grid |
| **Choice** | Gem Hunt, Treasure Map, Door Pick, Safe Cracker |

Every game opens into a dedicated panel with the current balance, the title, short rules, the game controls, a **Play** button, a result area showing coins won/lost and XP gained, and a **Play Again** button.

### Progression
Coins, XP, levels (1–100), daily rewards, streaks, **22 achievements**, an inventory of **22 collectibles**, and a six-tier rarity system: Common, Uncommon, Rare, Epic, Legendary, Mythic.

### Profile
Avatar picker, username, level, XP, coin balance, total games, wins, losses, win rate, favourite game, achievement list, collection progress, recent game history, settings, and a reset option.

### Inventory
Collectibles in a grid, each with name, icon, rarity, description and quantity. Filter by rarity; uncollected items show as undiscovered.

---

## Architecture

The app is deliberately **not** 38 separate implementations. Games share a small set of reusable engines, and all economy logic lives in one place.

```
app/
  layout.tsx            App shell: provider, bottom nav, achievement toast
  page.tsx              Home
  games/page.tsx        Searchable game grid
  games/[id]/page.tsx   Game detail — resolves the engine from the registry
  inventory/page.tsx    Inventory
  profile/page.tsx      Profile
components/
  Card, GameButton, CoinBalance, XPBar, GameCard, ResultPanel,
  RewardReveal, Dice, SlotReel, Grid, Wheel, BottomNav, WagerPicker,
  GameShell, AchievementToast
  engines/
    index.tsx           EngineId -> component map (the only wiring point)
    useGameFlow.ts      Shared wager / play / settle / result flow
    shared.ts           Typed option readers
    PickEngine, DiceEngine, HighCardEngine, WheelEngine, SlotsEngine,
    BlackjackEngine, PlinkoEngine, MultiplierEngine, GridEngine,
    NumberEngine, ScratchEngine, ChestEngine
lib/
  types.ts              Domain types
  store.tsx             React context + localStorage persistence
  games.ts              Central game registry (id, name, category, engine, options)
  levels.ts             XP curve and level maths
  items.ts              Collectible catalogue
  achievements.ts       Achievement definitions and predicates
  rewards.ts            RNG helpers, rarity table, payout maths, formatting
```

### Adding a game

Adding a game that reuses an existing engine is a **single entry** in `lib/games.ts`:

```ts
{
  id: "my-game",
  name: "My Game",
  category: "chance",
  description: "One line for the card.",
  icon: "🎲",
  engine: "pick",                       // reuse an existing engine
  rules: "Short rules shown in the panel.",
  options: { choices: ["A", "B"], multiplier: 1.9 },
}
```

It then appears in the grid, the search, and its own route automatically. A genuinely new mechanic means adding one engine component and one line in `components/engines/index.tsx`.

### Shared economy

Every game settles through the same `play()` call in `lib/store.tsx`, so balance, XP, level, statistics, history, achievements and inventory are updated identically everywhere. A game only reports *what happened* (won/lost/push, multiplier, optional item) — it never touches the balance itself.

### Persistence

State is held in React context and persisted to `localStorage` under `coin-arcade:v1`. Saves are versioned and sanitised on load, so a corrupt or partial save falls back to a fresh one instead of crashing. The store is the single seam where a future database or auth layer would be added — swap the persistence effect for an API call and the rest of the app is unchanged.

---

## Verification

- `npm run build` — passes clean (TypeScript + production build)
- `npm run lint` — no warnings or errors
- All routes return HTTP 200
- Gameplay, coin/XP accounting, and `localStorage` persistence verified in a real browser

---

## Licence

MIT
