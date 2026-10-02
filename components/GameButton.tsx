"use client";

import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface GameButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  full?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent/90 active:bg-accent/80 disabled:bg-accent/40",
  secondary:
    "bg-surface2 text-ink border border-line hover:bg-surface2/70 active:bg-surface2/50 disabled:opacity-50",
  ghost:
    "bg-transparent text-muted hover:text-ink hover:bg-surface2/60 disabled:opacity-40",
  danger:
    "bg-bad/90 text-white hover:bg-bad active:bg-bad/80 disabled:opacity-50",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export function GameButton({
  variant = "primary",
  size = "md",
  full = false,
  className = "",
  children,
  ...rest
}: GameButtonProps) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${full ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
