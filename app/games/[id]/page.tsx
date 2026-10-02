"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getGame } from "@/lib/games";
import { GameShell } from "@/components/GameShell";
import { ENGINES } from "@/components/engines";

export default function GamePage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const game = getGame(id);

  if (!game) {
    return (
      <div className="space-y-4 py-10 text-center">
        <div className="text-4xl" aria-hidden>
          🎮
        </div>
        <h1 className="text-lg font-semibold">Game not found</h1>
        <p className="text-xs text-muted">
          That game doesn&apos;t exist in the arcade.
        </p>
        <Link
          href="/games"
          className="inline-block rounded-lg border border-line bg-surface2 px-4 py-2 text-sm text-ink"
        >
          Back to Games
        </Link>
      </div>
    );
  }

  const Engine = ENGINES[game.engine];

  return (
    <GameShell game={game}>
      <Engine game={game} />
    </GameShell>
  );
}
