import React from 'react';
import Link from 'next/link';
import { ShellContext } from './ShellContext';

export default function GlobalShell({ children }: { children: React.ReactNode }) {
  return (
    <ShellContext.Provider value={{ hasShell: true }}>
      <div className="min-h-screen">
        <div className="md:flex">
          <aside className="hidden md:block fixed left-0 top-0 bottom-0 w-64 shrink-0 border-r bg-white overflow-y-auto">
            <div className="p-4">
              <Link href="/newsroom/dashboard" className="block text-lg font-semibold mb-3 hover:underline">NewsRoom</Link>
              {/* ShellContext renders profile mini here */}
              <div id="__wn_profile_mini" />
              <nav className="mt-4 space-y-1">
                <Link className="block px-2 py-1 rounded hover:bg-gray-50" href="/newsroom/dashboard">Dashboard</Link>
                <Link className="block px-2 py-1 rounded hover:bg-gray-50" href="/newsroom">Publisher</Link>
                <Link className="block px-2 py-1 rounded hover:bg-gray-50" href="/newsroom/media">Media</Link>
                <Link className="block px-2 py-1 rounded hover:bg-gray-50" href="/newsroom/collab">Collaboration</Link>
                <Link className="block px-2 py-1 rounded hover:bg-gray-50" href="/newsroom/notice-board">Notice Board</Link>
                <Link className="block px-2 py-1 rounded hover:bg-gray-50" href="/newsroom/profile">Profile & Settings</Link>
                <Link className="block px-2 py-1 rounded hover:bg-gray-50" href="/newsroom/help">Help</Link>
              </nav>
            </div>
          </aside>
          <main className="flex-1 md:pl-64">
            {children}
          </main>
        </div>
      </div>
    </ShellContext.Provider>
  );
}

