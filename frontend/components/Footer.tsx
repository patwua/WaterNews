import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-8 border-t bg-black text-neutral-200">
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-6 text-sm">
        <nav className="flex flex-wrap gap-4 mb-2">
          <Link href="/about" className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 rounded">About</Link>
          <Link href="/contact" className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 rounded">Contact</Link>
          <Link href="/suggest" className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 rounded">Suggest a Story</Link>
          <Link href="/privacy" className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 rounded">Privacy Policy</Link>
          <Link href="/prefs" className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 rounded">Preferences</Link>
          <Link href="/login" className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 rounded">Login</Link>
        </nav>
        <div className="text-neutral-400">
          © {new Date().getFullYear()} WaterNewsGY
        </div>
      </div>
    </footer>
  )
}

