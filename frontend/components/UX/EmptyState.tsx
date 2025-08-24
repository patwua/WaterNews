import React from "react";

export default function EmptyState({
  title = "Nothing to show",
  children,
  icon,
  className = "",
}: {
  title?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl ring-1 ring-gray-200 p-8 bg-white text-center ${className}`}>
      <div className="mx-auto w-12 h-12 mb-3 text-gray-400">
        {icon ?? (
          <svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
            <path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14l4-4h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/>
          </svg>
        )}
      </div>
      <div className="text-lg font-semibold">{title}</div>
      {children && <div className="mt-1 text-sm text-gray-600">{children}</div>}
    </div>
  );
}
