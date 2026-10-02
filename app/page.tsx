"use client";

import React from "react";
import Link from "next/link";
import { useArcade, canClaimDaily, nextStreak, dailyRewardFor } from "@/lib/store";
import { GAME_MAP, FEATURED_GAMES } from "@/lib/games";
import { formatCoins } from "@/lib/rewards";
import { Card, CardHeader } from "@/components/Card";
import { CoinBalance } from "@/components/CoinBalance";
import { XPBar } from "@/components/XPBar";
import { GameCard } from "@/components/GameCard";
import { GameButton } from "@/components/GameButton";

export default function HomePage() {
  const { state, hydrated, claimDaily } = useArcade();
  const [claimed, setClaimed] = React.useState(0);

  const claimable = hydrated && canClaimDaily(state);
  const streak = hydrated ? nextStreak(state) : 1;
  const reward = dailyRewardFor(streak);

  const recent = React.useMemo(() => {
    const seen: string[] = [];
    for (const h of state.history) {
      if (!seen.includes(h.gameId) && GAME_MAP[h.gameId]) seen.push(h.gameId);
      if (seen.length >= 4) break;
    }
    return seen.map((id) => GAME_MAP[id]);
  }, [state.history]);

  const onClaim = () => {
    const got = claimDaily();
    setClaimed(got);
  };

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Coin Arcade</h1>
          <p className="text-xs text-muted">Short games. Virtual Coins.</p>
        </div>
        <CoinBalance size="md" />
      </header>

      <Card>
        <XPBar />
      </Card>

      <Card>
        <CardHeader
          title="Daily reward"
          subtitle={
            hydrated
              ? `Streak: ${state.daily.streak} day${state.daily.streak === 1 ? "" : "s"}`
              : "—"
          }
        />
        {claimable ? (
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-muted">
              Day {streak} · <span className="text-coin">+{formatCoins(reward)} Coins</span>
            </div>
            <GameButton size="sm" onClick={onClaim}>
              Claim
            </GameButton>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-muted">
              {claimed > 0
                ? `Claimed +${formatCoins(claimed)} Coins.`
                : "Already claimed today."}
            </div>
            <span className="text-xs text-muted">Come back tomorrow</span>
          </div>
        )}
      </Card>

      {recent.length > 0 ? (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recently played</h2>
            <Link href="/games" className="text-xs text-muted hover:text-ink">
              All games
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {recent.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Featured</h2>
          <Link href="/games" className="text-xs text-muted hover:text-ink">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {FEATURED_GAMES.slice(0, 6).map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      </section>

      <p className="pt-2 text-center text-[11px] leading-relaxed text-muted">
        Coins are a fictional in-app currency with no real-world value. They
        cannot be bought, sold, withdrawn, or exchanged for money.
      </p>
    </div>
  );
}
