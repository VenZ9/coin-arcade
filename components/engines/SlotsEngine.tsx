"use client";

import React, { useState } from "react";
import { GameButton } from "../GameButton";
import { ResultPanel } from "../ResultPanel";
import { WagerPicker } from "../WagerPicker";
import { SlotReel } from "../SlotReel";
import { useGameFlow } from "./useGameFlow";
import { optArr, optNum, type EngineProps } from "./shared";
import { randInt } from "@/lib/rewards";

const DEFAULT_SYMBOLS = ["🍒", "🍋", "🔔", "⭐", "💎", "7️⃣"];

export function SlotsEngine({ game }: EngineProps) {
  const flow = useGameFlow(game);
  const reels = optNum(game.options, "reels", 3);
  const symbols = optArr<string>(game.options, "symbols", DEFAULT_SYMBOLS);
  const [faces, setFaces] = useState<string[]>([]);
  const [spinning, setSpinning] = useState(false);

  const play = () => {
    if (!flow.canPlay) return;
    flow.setStatus("playing");
    setSpinning(true);
    setFaces([]);
    window.setTimeout(() => {
      const result = Array.from(
        { length: reels },
        () => symbols[randInt(0, symbols.length - 1)]
      );
      setFaces(result);
      setSpinning(false);
      const counts: Record<string, number> = {};
      for (const s of result) counts[s] = (counts[s] ?? 0) + 1;
      const best = Math.max(...Object.values(counts));
      if (best === reels) {
        const mult = result[0] === "7️⃣" ? 25 : result[0] === "💎" ? 15 : 10;
        flow.settle({ won: true, multiplier: mult, detail: `${reels} of a kind!` });
      } else if (best === reels - 1) {
        flow.settle({ won: true, multiplier: 1.5, detail: "Two of a kind." });
      } else {
        flow.settle({ won: false, multiplier: 0, detail: "No match." });
      }
    }, 900);
  };

  const again = () => {
    flow.reset();
    setFaces([]);
  };

  const shown = faces.length
    ? faces
    : Array.from({ length: reels }, () => "❔");

  return (
    <div className="space-y-4">
      <WagerPicker value={flow.wager} onChange={flow.setWager} disabled={spinning} />
      <div className="flex items-center justify-center gap-2 rounded-xl border border-line bg-surface p-4">
        {shown.map((s, i) => (
          <SlotReel
            key={i}
            symbol={s}
            spinning={spinning}
            highlight={!spinning && faces.length > 0}
          />
        ))}
      </div>
      <GameButton full size="lg" onClick={play} disabled={!flow.canPlay || spinning}>
        {spinning ? "Spinning…" : "Play"}
      </GameButton>
      <ResultPanel
        status={flow.status}
        message={flow.message}
        net={flow.net}
        xp={flow.xp}
        onPlayAgain={flow.status === "idle" ? undefined : again}
        disabled={!flow.canPlay}
      />
    </div>
  );
}
