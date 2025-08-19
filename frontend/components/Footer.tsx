import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t bg-neutral-50 text-sm text-neutral-600 dark:bg-neutral-950 dark:text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" aria-label="WaterNews — Home" className="inline-flex items-center gap-2">
            <Image
              src="/logo-mini.svg"
              alt="WaterNews mini logo"
              width={28}
              height={28}
              className="h-7 w-7"
            />
            <span className="sr-only">WaterNews</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-4">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/suggest">Suggest a Story</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/prefs">Preferences</Link>
            <Link href="/login">Login</Link>
          </nav>
        </div>
        <div className="mt-8 text-xs text-neutral-500 dark:text-neutral-400">
          © {new Date().getFullYear()} WaterNewsGY
        </div>
      </div>
    </footer>
  );
}

