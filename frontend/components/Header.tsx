import { useState } from 'react'
import Link from 'next/link'
import FollowButton from './FollowButton'

export default function Header() {
  const [showSearch, setShowSearch] = useState(false)

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="font-extrabold text-xl tracking-tight">
          WaterNews
        </Link>

        <nav className="ml-2 flex items-center gap-3 text-sm text-gray-700">
          <Link className="hover:text-blue-700" href="/?sort=recent">Recent</Link>
          <Link className="hover:text-blue-700" href="/?sort=trending">Trending</Link>
          <Link className="hover:text-blue-700" href="/?view=categories">Categories</Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowSearch((s) => !s)}
              className="text-sm px-2 py-1 rounded hover:bg-gray-100"
              aria-label="Toggle search"
              title="Search"
            >
              🔍
            </button>
            {showSearch && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow p-2">
                <input
                  type="search"
                  placeholder="Search WaterNews..."
                  className="w-full border rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            )}
          </div>

          <FollowButton />
        </div>
      </div>
    </header>
  )
}
