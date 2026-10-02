"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/games", label: "Games", icon: "🎮" },
  { href: "/inventory", label: "Inventory", icon: "🎒" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 backdrop-blur"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-app items-stretch">
        {ITEMS.map((it) => {
          const active =
            it.href === "/"
              ? pathname === "/"
              : pathname.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] transition-colors ${
                active ? "text-accent" : "text-muted hover:text-ink"
              }`}
            >
              <span className="text-lg" aria-hidden>
                {it.icon}
              </span>
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
