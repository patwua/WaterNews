// Add FAQ link to footer nav
import Link from "next/link";
import BrandLogo from "./BrandLogo";

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
        <BrandLogo variant="mark" tone="dark" width={28} height={28} className="opacity-95" />
        <nav className="text-sm flex-1 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/about#standards" className="hover:underline">
            Editorial Standards
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <Link href="/faq" className="hover:underline">
            FAQ
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
        </nav>
        <div className="text-xs text-gray-300">© {new Date().getFullYear()} WaterNewsGY</div>
      </div>
    </footer>
  );
}

