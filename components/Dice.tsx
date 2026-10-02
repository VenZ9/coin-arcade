"use client";

import React from "react";

export function Dice({
  value,
  sides = 6,
  rolling = false,
  size = "md",
}: {
  value: number;
  sides?: number;
  rolling?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dim =
    size === "lg" ? "h-16 w-16 text-3xl" : size === "sm" ? "h-9 w-9 text-base" : "h-12 w-12 text-xl";
  const pips: Record<number, string> = {
    1: "⚀",
    2: "⚁",
    3: "⚂",
    4: "⚃",
    5: "⚄",
    6: "⚅",
  };
  const face = sides === 6 && pips[value] ? pips[value] : String(value);

  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-line bg-surface2 font-semibold text-ink ${dim} ${rolling ? "animate-pulse" : ""}`}
      aria-label={`Die showing ${value}`}
    >
      {face}
    </div>
  );
}
