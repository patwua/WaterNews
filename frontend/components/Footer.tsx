import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-gray-600">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/about" className="hover:text-blue-700">About</Link>
          <Link href="/contact" className="hover:text-blue-700">Contact</Link>
          <Link href="/suggest" className="hover:text-blue-700">Suggest a Story</Link>
          <Link href="/privacy" className="hover:text-blue-700">Privacy Policy</Link>
          <span className="opacity-50">•</span>
          <Link href="/login" className="hover:text-blue-700">Login</Link>
        </div>
        <div className="mt-2 text-xs text-gray-400">© {new Date().getFullYear()} WaterNewsGY</div>
      </div>
    </footer>
  )
}
