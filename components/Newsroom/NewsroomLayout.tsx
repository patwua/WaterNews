import React from "react";

type Props = {
  title?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

// Minimal, shell-agnostic layout for Newsroom pages.
// GlobalShell now owns all sidebar/topbar logic across the app.
export default function NewsroomLayout({ title = "Newsroom", actions, children }: Props) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <div>{actions}</div>
      </div>
      {children}
    </div>
  );
}
