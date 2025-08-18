import Link from "next/link";
import SmartMenu from "@/components/SmartMenu";
import SearchBox from "@/components/SearchBox";
import NotificationsBellMenu from "@/components/NotificationsBellMenu";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-neutral-950/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-neutral-950/60 border-b border-black/5 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-3 md:px-4 h-14 flex items-center justify-between gap-3">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            {/* Use existing logo asset */}
            <img src="/logo-waternews.svg" alt="WaterNews" className="h-7 w-auto" />
            <span className="sr-only">WaterNews home</span>
          </Link>
        </div>

        {/* Center: SmartMenu */}
        <div className="hidden md:flex flex-1 justify-center">
          <SmartMenu />
        </div>

        {/* Right: Search (icon expands) · Bell · Theme */}
        <div className="flex items-center gap-2">
          <SearchBox iconOnly />
          <NotificationsBellMenu />
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
