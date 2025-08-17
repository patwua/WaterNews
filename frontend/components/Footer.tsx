import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-10 w-full bg-black text-neutral-200">
      <div className="max-w-7xl mx-auto px-4 py-6 text-sm">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/about" className="hover:underline text-neutral-200">About</Link>
          <Link href="/contact" className="hover:underline text-neutral-200">Contact</Link>
          <Link href="/suggest" className="hover:underline text-neutral-200">Suggest a Story</Link>
          <Link href="/privacy" className="hover:underline text-neutral-200">Privacy Policy</Link>
          <span className="opacity-50">•</span>
          <Link href="/login" className="hover:underline text-neutral-200">Login</Link>
        </div>
        <div className="mt-2 text-xs text-neutral-400">© {new Date().getFullYear()} WaterNewsGY</div>
      </div>
    </footer>
  )
}
