import React from "react";

type Variant = "info" | "success" | "warning" | "danger";

const styles: Record<Variant, { bg: string; ring: string; text: string }> = {
  info:    { bg: "bg-blue-50",   ring: "ring-blue-200",   text: "text-blue-800" },
  success: { bg: "bg-green-50",  ring: "ring-green-200",  text: "text-green-800" },
  warning: { bg: "bg-amber-50",  ring: "ring-amber-200",  text: "text-amber-900" },
  danger:  { bg: "bg-red-50",    ring: "ring-red-200",    text: "text-red-800" },
};

export default function Callout({
  variant = "info",
  title,
  children,
  className = "",
}: {
  variant?: Variant;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const s = styles[variant];
  return (
    <div className={`rounded-lg ${s.bg} ${s.text} ring-1 ${s.ring} p-3 sm:p-4 ${className}`}>
      {title && <div className="font-semibold mb-1">{title}</div>}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
