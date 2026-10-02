import React from "react";
import Link from "next/link";
import type { GameConfig } from "@/lib/games";
import { CATEGORY_META } from "@/lib/games";

export function GameCard({ game }: { game: GameConfig }) {
  return (
    <Link
      href={`/games/${game.id}`}
      className="group flex flex-col rounded-xl border border-line bg-surface p-3 transition-colors hover:border-accent/50 hover:bg-surface2/60"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-2xl" aria-hidden>
          {game.icon}
        </span>
        <span className="rounded-md border border-line px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted">
          {CATEGORY_META[game.category].label}
        </span>
      </div>
      <div className="text-sm font-semibold text-ink">{game.name}</div>
      <div className="mt-0.5 line-clamp-2 text-xs text-muted">
        {game.description}
      </div>
    </Link>
  );
}
