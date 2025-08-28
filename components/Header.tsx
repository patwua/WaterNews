import SmartMenu from "@/components/SmartMenu";
import SearchBox from "@/components/SearchBox";
import NotificationsBellMenu from "@/components/NotificationsBellMenu";
import BreakingTicker from "@/components/BreakingTicker";
import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { useEffect, useState } from "react";
import ProfilePhoto from "@/components/User/ProfilePhoto";
import { useShell } from "@/components/Newsroom/ShellContext";

export default function Header() {
  const [me, setMe] = useState<any>(null);
  const { user } = useShell();
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/users/me");
        if (r.ok) setMe(await r.json());
      } catch {}
    })();
  }, []);
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur md:ml-64">
      {/* Top row: logo • SmartMenu • actions */}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link
          href={me?.email ? "/newsroom/writer-dashboard" : "/"}
          aria-label="WaterNews — Home"
          className="shrink-0 inline-flex items-center"
        >
          <BrandLogo width={160} height={64} className="h-16 w-auto" />
        </Link>
        {/* center: SmartMenu */}
        <div className="flex-1 min-w-0">
          <SmartMenu />
        </div>
        {/* right actions: inline expanding search + bell (Newsroom handled via sidebar) */}
        <div className="flex items-center gap-2">
          <SearchBox />
          <NotificationsBellMenu />
          {!user && (
            <Link href="/newsroom" className="text-sm text-gray-700 hover:underline">
              Newsroom
            </Link>
          )}
          {me && (
            <Link href="/account" className="inline-flex items-center">
              <ProfilePhoto
                name={me.displayName || me.name}
                url={me.profilePhotoUrl}
                isVerified={me.verified?.status === true}
                isOrganization={me.isOrganization === true}
                size={32}
                className="shrink-0"
              />
            </Link>
          )}
        </div>
      </div>
      {/* Bottom row: ticker inside header so it always sticks */}
      <div className="border-t">
        <BreakingTicker />
      </div>
    </header>
  );
}

