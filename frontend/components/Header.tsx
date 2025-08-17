import Link from 'next/link'
import NotificationsBellMenu from './NotificationsBellMenu'
import SmartMenu from './SmartMenu'
import dynamic from 'next/dynamic'

const SearchBox = dynamic(() => import('./SearchBox'), { ssr: false })

export default function Header() {
  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-3 md:px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 rounded">
            <img src="/logo-waternews.svg" alt="WaterNewsGY" className="h-6" />
            <span className="sr-only">WaterNewsGY</span>
          </Link>
        </div>

        <div className="hidden md:block flex-1 mx-4">
          <SearchBox />
        </div>

        <nav className="flex items-center gap-2">
          <NotificationsBellMenu />
          <SmartMenu />
        </nav>
      </div>
    </header>
  )
}
