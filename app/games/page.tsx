"use client";

import React, { useMemo, useState } from "react";
import { GAMES, CATEGORY_META, CATEGORY_ORDER } from "@/lib/games";
import type { Category } from "@/lib/types";
import { GameCard } from "@/components/GameCard";

type Filter = Category | "all";

export default function GamesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GAMES.filter((g) => {
      if (filter !== "all" && g.category !== filter) return false;
      if (!q) return true;
      return (
        g.name.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.category.includes(q)
      );
    });
  }, [query, filter]);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold tracking-tight">Games</h1>
        <p className="text-xs text-muted">
          {GAMES.length} games across {CATEGORY_ORDER.length} categories.
        </p>
      </header>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search games…"
        aria-label="Search games"
        className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          aria-pressed={filter === "all"}
          className={`h-8 rounded-lg border px-3 text-xs font-medium transition-colors ${
            filter === "all"
              ? "border-accent bg-accent/15 text-accent"
              : "border-line bg-surface2 text-muted hover:text-ink"
          }`}
        >
          All
        </button>
        {CATEGORY_ORDER.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            aria-pressed={filter === c}
            className={`h-8 rounded-lg border px-3 text-xs font-medium transition-colors ${
              filter === c
                ? "border-accent bg-accent/15 text-accent"
                : "border-line bg-surface2 text-muted hover:text-ink"
            }`}
          >
            {CATEGORY_META[c].icon} {CATEGORY_META[c].label}
          </button>
        ))}
      </div>

      {results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-surface/50 p-8 text-center text-xs text-muted">
          No games match “{query}”.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {results.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      )}
    </div>
  );
}
