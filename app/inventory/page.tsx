"use client";

import React, { useMemo, useState } from "react";
import { useArcade } from "@/lib/store";
import { ITEMS, ITEM_MAP, TOTAL_ITEMS } from "@/lib/items";
import { RARITY_META, RARITY_ORDER } from "@/lib/rewards";
import type { Rarity } from "@/lib/types";
import { Card } from "@/components/Card";

type Filter = Rarity | "all";

export default function InventoryPage() {
  const { state, hydrated } = useArcade();
  const [filter, setFilter] = useState<Filter>("all");

  const owned = useMemo(() => {
    const map = new Map(state.inventory.map((e) => [e.itemId, e.quantity]));
    return map;
  }, [state.inventory]);

  const uniqueOwned = state.inventory.length;
  const pct = Math.round((uniqueOwned / TOTAL_ITEMS) * 100);

  const shown = useMemo(() => {
    const list = filter === "all" ? ITEMS : ITEMS.filter((i) => i.rarity === filter);
    return [...list].sort(
      (a, b) =>
        RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity) ||
        a.name.localeCompare(b.name)
    );
  }, [filter]);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold tracking-tight">Inventory</h1>
        <p className="text-xs text-muted">
          {hydrated ? `${uniqueOwned} of ${TOTAL_ITEMS} collected` : "—"}
        </p>
      </header>

      <Card>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-muted">Collection progress</span>
          <span className="tabular-nums text-ink">{hydrated ? `${pct}%` : "—"}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface2">
          <div
            className="h-full rounded-full bg-coin transition-[width] duration-300"
            style={{ width: `${hydrated ? pct : 0}%` }}
          />
        </div>
      </Card>

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
        {RARITY_ORDER.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setFilter(r)}
            aria-pressed={filter === r}
            className={`h-8 rounded-lg border px-3 text-xs font-medium transition-colors ${
              filter === r
                ? "border-accent bg-accent/15 text-accent"
                : "border-line bg-surface2 text-muted hover:text-ink"
            }`}
          >
            {RARITY_META[r].label}
          </button>
        ))}
      </div>

      {uniqueOwned === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-surface/50 p-8 text-center text-xs text-muted">
          No items yet. Play Mystery Box or Treasure Chests to find some.
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-2">
        {shown.map((item) => {
          const qty = owned.get(item.id) ?? 0;
          const meta = RARITY_META[item.rarity];
          const has = qty > 0;
          return (
            <div
              key={item.id}
              className={`rounded-xl border p-3 ${meta.border} ${meta.bg} ${
                has ? "" : "opacity-45"
              }`}
            >
              <div className="mb-1 flex items-start justify-between">
                <span className="text-2xl" aria-hidden>
                  {has ? item.icon : "❔"}
                </span>
                {has && qty > 1 ? (
                  <span className="rounded-md border border-line bg-bg/60 px-1.5 py-0.5 text-[10px] tabular-nums text-muted">
                    ×{qty}
                  </span>
                ) : null}
              </div>
              <div className="text-xs font-semibold text-ink">
                {has ? item.name : "Undiscovered"}
              </div>
              <div className={`text-[10px] font-medium ${meta.text}`}>
                {meta.label}
              </div>
              <p className="mt-1 line-clamp-2 text-[11px] text-muted">
                {has ? item.description : "Keep playing to reveal this item."}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
