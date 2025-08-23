// Add FAQ link to footer nav
import Link from "next/link";
import Image from "next/image";
import { withCloudinaryAuto } from "@/lib/media";

export default function Footer() {
  return (
    <footer className="border-t bg-black text-sm text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <Link href="/" aria-label="WaterNews — Home" className="inline-flex items-center gap-2">
            <Image
              src={withCloudinaryAuto(
                "https://res.cloudinary.com/dpdhi4joq/image/upload/v1755962658/logo-mini_uhsj21.png"
              )}
              alt="WaterNews mini logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="sr-only">WaterNews</span>
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/apply">Apply</Link>
            <Link href="/corrections">Corrections</Link>
            <Link href="/suggest-story">Suggest a Story</Link>
            <Link href="/editorial-standards">Editorial Standards</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/prefs">Preferences</Link>
            <Link href="/login">Login</Link>
          </nav>
          <div className="text-xs text-neutral-400">© {new Date().getFullYear()} WaterNewsGY</div>
        </div>
      </div>
    </footer>
  );
}

