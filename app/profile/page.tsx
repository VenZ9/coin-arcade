"use client";

import React, { useMemo, useState } from "react";
import { useArcade, AVATARS } from "@/lib/store";
import { ACHIEVEMENTS, TOTAL_ACHIEVEMENTS } from "@/lib/achievements";
import { GAME_MAP } from "@/lib/games";
import { ITEM_MAP, TOTAL_ITEMS } from "@/lib/items";
import { formatCoins } from "@/lib/rewards";
import { Card, CardHeader } from "@/components/Card";
import { CoinBalance } from "@/components/CoinBalance";
import { XPBar } from "@/components/XPBar";
import { GameButton } from "@/components/GameButton";

export default function ProfilePage() {
  const {
    state,
    hydrated,
    progress,
    setUsername,
    setAvatar,
    updateSettings,
    resetProgress,
  } = useArcade();

  const [name, setName] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  const favorite = useMemo(() => {
    const entries = Object.entries(state.stats.perGame);
    if (entries.length === 0) return null;
    const [id] = entries.sort((a, b) => b[1].played - a[1].played)[0];
    return GAME_MAP[id] ?? null;
  }, [state.stats.perGame]);

  const winRate =
    state.stats.totalGames > 0
      ? Math.round((state.stats.wins / state.stats.totalGames) * 100)
      : 0;

  const unlocked = state.achievements.length;

  const recent = state.history.slice(0, 8);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold tracking-tight">Profile</h1>
      </header>

      <Card>
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface2 text-3xl">
            {state.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-base font-semibold text-ink">
              {hydrated ? state.username : "—"}
            </div>
            <div className="text-xs text-muted">
              Level {hydrated ? progress.level : "—"}
            </div>
          </div>
          <CoinBalance size="sm" showLabel={false} />
        </div>
        <div className="mt-4">
          <XPBar />
        </div>
      </Card>

      <Card>
        <CardHeader title="Avatar" />
        <div className="flex flex-wrap gap-2">
          {AVATARS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAvatar(a)}
              aria-pressed={state.avatar === a}
              aria-label={`Choose avatar ${a}`}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border text-xl transition-colors ${
                state.avatar === a
                  ? "border-accent bg-accent/15"
                  : "border-line bg-surface2 hover:border-accent/40"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Username" />
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            maxLength={20}
            onChange={(e) => setName(e.target.value)}
            placeholder={state.username}
            aria-label="Username"
            className="h-10 flex-1 rounded-lg border border-line bg-surface2 px-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <GameButton
            onClick={() => {
              setUsername(name);
              setName("");
            }}
            disabled={!name.trim()}
          >
            Save
          </GameButton>
        </div>
      </Card>

      <Card>
        <CardHeader title="Statistics" />
        <dl className="grid grid-cols-2 gap-3 text-xs">
          {[
            ["Games played", state.stats.totalGames.toLocaleString("en-US")],
            ["Wins", state.stats.wins.toLocaleString("en-US")],
            ["Losses", state.stats.losses.toLocaleString("en-US")],
            ["Win rate", `${winRate}%`],
            ["Total wagered", formatCoins(state.stats.totalWagered)],
            ["Best win", formatCoins(state.stats.bestWin)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-line bg-surface2/50 p-2.5">
              <dt className="text-[10px] uppercase tracking-wide text-muted">
                {label}
              </dt>
              <dd className="mt-0.5 text-sm font-semibold tabular-nums text-ink">
                {hydrated ? value : "—"}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 flex items-center justify-between rounded-lg border border-line bg-surface2/50 p-2.5 text-xs">
          <span className="text-[10px] uppercase tracking-wide text-muted">
            Favourite game
          </span>
          <span className="font-semibold text-ink">
            {favorite ? `${favorite.icon} ${favorite.name}` : "—"}
          </span>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Achievements"
          subtitle={`${unlocked} of ${TOTAL_ACHIEVEMENTS} unlocked`}
        />
        <ul className="space-y-2">
          {ACHIEVEMENTS.map((a) => {
            const has = state.achievements.includes(a.id);
            return (
              <li
                key={a.id}
                className={`flex items-center gap-3 rounded-lg border p-2.5 ${
                  has
                    ? "border-coin/40 bg-coin/5"
                    : "border-line bg-surface2/40 opacity-60"
                }`}
              >
                <span className="text-xl" aria-hidden>
                  {has ? a.icon : "🔒"}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-xs font-semibold text-ink">
                    {a.name}
                  </div>
                  <div className="truncate text-[11px] text-muted">
                    {a.description}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card>
        <CardHeader
          title="Collection"
          subtitle={`${state.inventory.length} of ${TOTAL_ITEMS} items`}
        />
        <div className="flex flex-wrap gap-1.5">
          {state.inventory.length === 0 ? (
            <span className="text-xs text-muted">No items collected yet.</span>
          ) : (
            state.inventory.map((e) => {
              const item = ITEM_MAP[e.itemId];
              if (!item) return null;
              return (
                <span
                  key={e.itemId}
                  title={item.name}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface2 text-lg"
                >
                  {item.icon}
                </span>
              );
            })
          )}
        </div>
      </Card>

      {recent.length > 0 ? (
        <Card>
          <CardHeader title="Recent games" />
          <ul className="space-y-1.5">
            {recent.map((h, i) => {
              const g = GAME_MAP[h.gameId];
              return (
                <li
                  key={`${h.at}-${i}`}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="truncate text-muted">
                    {g ? `${g.icon} ${g.name}` : h.gameId}
                  </span>
                  <span
                    className={`tabular-nums ${
                      h.net > 0 ? "text-good" : h.net < 0 ? "text-bad" : "text-muted"
                    }`}
                  >
                    {h.net > 0 ? `+${formatCoins(h.net)}` : formatCoins(h.net)}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      ) : null}

      <Card>
        <CardHeader title="Settings" />
        <div className="space-y-2">
          {(
            [
              ["sound", "Sound effects"],
              ["haptics", "Haptics"],
              ["reduceMotion", "Reduce motion"],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex cursor-pointer items-center justify-between rounded-lg border border-line bg-surface2/50 p-2.5 text-xs"
            >
              <span className="text-ink">{label}</span>
              <input
                type="checkbox"
                checked={state.settings[key]}
                onChange={(e) => updateSettings({ [key]: e.target.checked })}
                className="h-4 w-4 accent-[#5b8cff]"
              />
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Reset progress"
          subtitle="Clears Coins, XP, items, stats and achievements on this device."
        />
        {confirmReset ? (
          <div className="flex gap-2">
            <GameButton
              variant="danger"
              full
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
              }}
            >
              Yes, reset everything
            </GameButton>
            <GameButton variant="secondary" full onClick={() => setConfirmReset(false)}>
              Cancel
            </GameButton>
          </div>
        ) : (
          <GameButton variant="secondary" full onClick={() => setConfirmReset(true)}>
            Reset
          </GameButton>
        )}
      </Card>

      <p className="pt-2 text-center text-[11px] leading-relaxed text-muted">
        Coins are a fictional in-app currency with no real-world value. This app
        has no deposits, withdrawals, cash-out, crypto, or payment providers.
      </p>
    </div>
  );
}
