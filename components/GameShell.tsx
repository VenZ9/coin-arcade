"use client";

import React from "react";
import Link from "next/link";
import type { GameConfig } from "@/lib/games";
import { CATEGORY_META } from "@/lib/games";
import { CoinBalance } from "./CoinBalance";
import { Card } from "./Card";

export function GameShell({
  game,
  children,
}: {
  game: GameConfig;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/games" className="text-xs text-muted hover:text-ink">
          ← Games
        </Link>
        <CoinBalance size="sm" showLabel={false} />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden>
          {game.icon}
        </span>
        <div>
          <h1 className="text-lg font-semibold text-ink">{game.name}</h1>
          <span className="text-[11px] uppercase tracking-wide text-muted">
            {CATEGORY_META[game.category].label}
          </span>
        </div>
      </div>

      <Card className="bg-surface/60">
        <p className="text-xs leading-relaxed text-muted">{game.rules}</p>
      </Card>

      {children}
    </div>
  );
}
