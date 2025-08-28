import React from "react";

export interface SectionCardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  id?: string;
  enabled?: boolean;
}

export default function SectionCard({
  title,
  children,
  footer,
  className = "",
  id,
  enabled,
}: SectionCardProps) {
  if (enabled === false) return null;

  return (
    <section
      id={id}
      className={`p-5 rounded-xl ring-1 ring-gray-200 bg-white/70 backdrop-blur ${className}`}
    >
      {title && <h2 className="text-lg font-semibold mb-3">{title}</h2>}
      <div>{children}</div>
      {footer && <div className="mt-4">{footer}</div>}
    </section>
  );
}
