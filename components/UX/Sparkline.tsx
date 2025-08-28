import React from "react";

export default function Sparkline({
  data,
  width = 120,
  height = 36,
  strokeWidth = 2,
  className = "",
}: {
  data: number[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const safe = Array.isArray(data) && data.length > 0 ? data : [0];
  const min = Math.min(...safe);
  const max = Math.max(...safe);
  const range = max - min || 1;
  const stepX = width / Math.max(1, safe.length - 1);
  const pts = safe
    .map((v, i) => {
      const x = i * stepX;
      const norm = (v - min) / range;
      const y = height - norm * height;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden="true"
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        points={pts}
      />
    </svg>
  );
}

