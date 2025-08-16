import Link from 'next/link'
import NotificationsBellMenu from './NotificationsBellMenu'
import SmartMenu from './SmartMenu'
import dynamic from 'next/dynamic'

// Lazy-load to keep header JS light
const SearchBox = dynamic(() => import('./SearchBox'), { ssr: false })

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo-waternews.svg" alt="WaterNewsGY" className="h-7 w-auto" />
        </Link>

        <nav className="ml-2 flex items-center gap-4">
          <SmartMenu />
          <a href="/search" className="hidden md:inline-block text-sm text-neutral-700 hover:underline">Search</a>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden md:block">
            <SearchBox />
          </div>
          <NotificationsBellMenu />
        </div>
      </div>
    </header>
  )
}
