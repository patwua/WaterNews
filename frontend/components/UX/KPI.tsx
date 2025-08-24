import React from "react";
import Sparkline from "./Sparkline";

export default function KPI({
  title,
  value,
  delta,
  data,
}: {
  title: string;
  value: string | number;
  delta?: number; // percentage (can be negative)
  data?: number[]; // for sparkline
}) {
  const up = typeof delta === "number" && delta > 0;
  const down = typeof delta === "number" && delta < 0;
  return (
    <div className="rounded-2xl ring-1 ring-gray-200 p-4 bg-white">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <div className="text-2xl font-semibold">{value}</div>
        {typeof delta === "number" && (
          <div
            className={`text-xs font-medium ${
              up ? "text-green-700" : down ? "text-red-700" : "text-gray-600"
            }`}
          >
            {up ? "▲" : down ? "▼" : "•"} {Math.abs(delta)}%
          </div>
        )}
      </div>
      {Array.isArray(data) && data.length > 0 && (
        <div className="mt-2 text-gray-400">
          <Sparkline data={data} />
        </div>
      )}
    </div>
  );
}

