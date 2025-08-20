import Link from "next/link";
import Icon from "./Icon";
import BrandLogo from "./BrandLogo";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100">
      <Link href="/" className="flex items-center gap-2">
        <BrandLogo size={28} className="shrink-0" />
        <span className="font-bold text-xl text-gray-800">WaterNews</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/" aria-label="Home" className="text-gray-600 hover:text-blue-600 transition">
          <Icon name="home" />
        </Link>
        <Link href="/search" aria-label="Search" className="text-gray-600 hover:text-blue-600 transition">
          <Icon name="search" />
        </Link>
        <Link href="/notifications" aria-label="Notifications" className="text-gray-600 hover:text-blue-600 transition">
          <Icon name="bell" />
        </Link>
        <button aria-label="Menu" className="md:hidden text-gray-600 hover:text-blue-600 transition">
          <Icon name="menu" />
        </button>
      </div>
    </nav>
  );
}
