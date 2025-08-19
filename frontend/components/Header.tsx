import DarkModeToggle from "@/components/DarkModeToggle";
import SmartMenu from "@/components/SmartMenu";
import SearchBox from "@/components/SearchBox";
import NotificationsBellMenu from "@/components/NotificationsBellMenu";
import BreakingTicker from "@/components/BreakingTicker";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-[60] border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-slate-800 dark:bg-slate-900/80">
      {/* Top row: logo • SmartMenu • actions */}
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-3 md:h-16 md:px-4">
        <Link href="/" aria-label="Home" className="inline-flex items-center">
          <img src="/logo-waternews.svg" alt="WaterNews logo" className="h-8 w-auto md:h-10 lg:h-12" />
        </Link>

        {/* center: SmartMenu */}
        <div className="mx-auto hidden flex-1 md:block"><SmartMenu /></div>

        {/* right actions: inline expanding search + bell + theme */}
        <div className="ml-auto flex items-center gap-2">
          <SearchBox mode="inline" />
          <NotificationsBellMenu variant="outline" />
          <DarkModeToggle />
        </div>
      </div>

      {/* Bottom row: ticker inside header so it always sticks */}
      <div className="border-t border-slate-200 bg-[#fffefc] dark:border-slate-800 dark:bg-slate-800">
        <BreakingTicker />
      </div>
    </header>
  );
}
