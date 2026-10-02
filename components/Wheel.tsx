"use client";

import React from "react";

export function Wheel({
  segments,
  rotation,
  spinning = false,
  size = 240,
}: {
  segments: number[];
  rotation: number;
  spinning?: boolean;
  size?: number;
}) {
  const n = segments.length;
  const seg = 360 / n;
  const r = size / 2;
  const colors = [
    "#5b8cff",
    "#3fb950",
    "#f0b429",
    "#f85149",
    "#a371f7",
    "#39c5cf",
  ];

  const arc = (i: number) => {
    const a0 = (i * seg - 90) * (Math.PI / 180);
    const a1 = ((i + 1) * seg - 90) * (Math.PI / 180);
    const x0 = r + r * Math.cos(a0);
    const y0 = r + r * Math.sin(a0);
    const x1 = r + r * Math.cos(a1);
    const y1 = r + r * Math.sin(a1);
    const large = seg > 180 ? 1 : 0;
    return `M ${r} ${r} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1 text-lg text-ink"
        aria-hidden
      >
        ▼
      </div>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning
            ? "transform 1.6s cubic-bezier(0.2, 0.8, 0.2, 1)"
            : "none",
        }}
        role="img"
        aria-label="Prize wheel"
      >
        {segments.map((v, i) => (
          <path
            key={i}
            d={arc(i)}
            fill={colors[i % colors.length]}
            opacity={v === 0 ? 0.35 : 0.9}
            stroke="#0b0d10"
            strokeWidth={1}
          />
        ))}
        {segments.map((v, i) => {
          const mid = (i * seg + seg / 2 - 90) * (Math.PI / 180);
          const tx = r + r * 0.66 * Math.cos(mid);
          const ty = r + r * 0.66 * Math.sin(mid);
          return (
            <text
              key={`t${i}`}
              x={tx}
              y={ty}
              fill="#0b0d10"
              fontSize={12}
              fontWeight={700}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {v === 0 ? "—" : `${v}×`}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
