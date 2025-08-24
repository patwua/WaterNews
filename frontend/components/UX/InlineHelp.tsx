import React from "react";

export default function InlineHelp({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-xs text-gray-600 mt-1 ${className}`}>
      {children}
    </p>
  );
}
