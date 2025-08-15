import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import NotificationBell from './NotificationBell'
import SmartMenu from './SmartMenu'
import { SearchIcon } from './icons'

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [q, setQ] = useState<string>((router.query.q as string) || '')

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  // Keep local q in sync if URL changes elsewhere
  useEffect(() => {
    setQ((router.query.q as string) || '')
  }, [router.query.q])

  const onType = (value: string) => {
    setQ(value)
    // Update URL shallowly for instant client filter
    router.replace({ pathname: router.pathname, query: { ...router.query, q: value || undefined } }, undefined, { shallow: true })
    // Notify listeners for instant client filter (no network)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('wn-search-type', { detail: value }))
    }
  }

  const onSubmit = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e) e.preventDefault()
    // Notify listeners that user hit Enter -> perform server search
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('wn-search-submit', { detail: q }))
    }
  }

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo-waternews.svg" alt="WaterNewsGY" className="h-7 w-auto" />
        </Link>

        {/* Smart menu (hidden when search expands on small screens) */}
        <nav className={`${searchOpen ? 'hidden md:block' : 'block'} ml-2`}>
          <SmartMenu />
        </nav>

        {/* Inline expanding search */}
        <div className={`flex-1 transition-all duration-200 ${searchOpen ? 'ml-2' : 'ml-auto md:ml-4'}`}>
          <div className="flex items-center gap-2 justify-end">
            {searchOpen && (
              <input
                ref={inputRef}
                type="search"
                value={q}
                onChange={(e)=>onType(e.target.value)}
                onKeyDown={(e)=>{ if (e.key === 'Enter') onSubmit(e) }}
                placeholder="Search WaterNews…"
                className="w-full md:w-2/3 lg:w-1/2 border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
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
