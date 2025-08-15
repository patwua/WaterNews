import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import NotificationBell from './NotificationBell'
import { SearchIcon } from './icons'

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo-waternews.svg" alt="WaterNewsGY" className="h-7 w-auto" />
        </Link>

        {/* Smart menu (hidden when search expands on small screens) */}
        <nav className={`ml-2 items-center gap-4 text-sm text-gray-700 ${searchOpen ? 'hidden md:flex' : 'flex'}`}>
          <Link className="hover:text-blue-700" href="/?sort=recent">Recent</Link>
          <Link className="hover:text-blue-700" href="/?sort=trending">Trending</Link>
          <Link className="hover:text-blue-700" href="/?view=categories">Categories</Link>
        </nav>

        {/* Inline expanding search */}
        <div className={`flex-1 transition-all duration-200 ${searchOpen ? 'ml-2' : 'ml-auto md:ml-4'}`}>
          <div className="flex items-center gap-2 justify-end">
            {searchOpen && (
              <input
                ref={inputRef}
                type="search"
                placeholder="Search WaterNews…"
                className="w-full md:w-2/3 lg:w-1/2 border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                onBlur={() => { /* keep open until icon toggled */ }}
              />
            )}
            <button
              onClick={() => setSearchOpen(s => !s)}
              aria-label="Search"
              title="Search"
              className="p-2 rounded hover:bg-gray-100"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
            <NotificationBell />
          </div>
        </div>
      </div>
    </header>
  )
}
