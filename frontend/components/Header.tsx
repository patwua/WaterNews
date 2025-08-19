import DarkModeToggle from "@/components/DarkModeToggle";
import SmartMenu from "@/components/SmartMenu";
import SearchBox from "@/components/SearchBox";
import NotificationsBellMenu from "@/components/NotificationsBellMenu";
import BreakingTicker from "@/components/BreakingTicker";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur dark:bg-neutral-950/80">
      {/* Top row: logo • SmartMenu • actions */}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link
          href="/"
          aria-label="WaterNews — Home"
          className="shrink-0 inline-flex items-center"
        >
          <Image
            src="/logo-waternews.svg"
            alt="WaterNews"
            width={156}
            height={28}
            priority
            className="h-7 w-auto"
          />
        </Link>

        {/* center: SmartMenu */}
        <div className="flex-1 min-w-0">
          <SmartMenu />
        </div>

        {/* right actions: inline expanding search + bell + theme */}
        <div className="flex items-center gap-2">
          <SearchBox />
          <NotificationsBellMenu />
          <DarkModeToggle />
        </div>
      </div>

      {/* Bottom row: ticker inside header so it always sticks */}
      <div className="border-t">
        <BreakingTicker />
      </div>
    </header>
  );
}
