import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}

export function Card({ children, className = "", as = "div" }: CardProps) {
  const Tag = as;
  return (
    <Tag
      className={`rounded-xl border border-line bg-surface p-4 ${className}`}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({
  title,
  action,
  subtitle,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold tracking-tight text-ink">{title}</h2>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-muted">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
