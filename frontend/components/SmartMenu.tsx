import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

type MenuKey = 'latest' | 'trending' | 'following'
const EXTRA_CATEGORIES = ['Regional', 'Politics', 'Sports', 'Business', 'Tech', 'Entertainment'] as const
export type ExtraCategory = typeof EXTRA_CATEGORIES[number]

/**
 * Pill-style smart menu with extra categories:
 * - Emits 'wn-menu-change' when main sort changes
 * - Emits 'wn-category-change' when a category is selected
 */
export default function SmartMenu() {
  const router = useRouter()
  const initial = (router.query.sort as string) as MenuKey
  const [active, setActive] = useState<MenuKey>(initial || 'latest')
  const [moreOpen, setMoreOpen] = useState(false)
  const [category, setCategory] = useState<ExtraCategory | null>((router.query.category as ExtraCategory) || null)

  useEffect(() => {
    const q = (router.query.sort as string) as MenuKey
    if (q && q !== active) setActive(q)
    const cat = (router.query.category as ExtraCategory) || null
    if (cat !== category) setCategory(cat)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.sort, router.query.category])

  const click = (key: MenuKey) => {
    setActive(key)
    router.replace(
      { pathname: router.pathname, query: { ...router.query, sort: key } },
      undefined,
      { shallow: true }
    )
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('wn-menu-change', { detail: key }))
    }
  }

  const clickCategory = (cat: ExtraCategory | null) => {
    setCategory(cat)
    router.replace(
      { pathname: router.pathname, query: { ...router.query, category: cat || undefined } },
      undefined,
      { shallow: true }
    )
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('wn-category-change', { detail: cat }))
    }
  }

  const pill = (key: MenuKey, label: string) => (
    <button
      key={key}
      onClick={() => click(key)}
      className={[
        'px-4 py-2 text-sm font-medium rounded-md transition-colors',
        active === key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-blue-700'
      ].join(' ')}
      aria-pressed={active === key}
    >
      {label}
    </button>
  )

  return (
    <div className="flex items-center gap-2">
      <div className="flex bg-gray-100 rounded-full p-1">
        {pill('latest', 'Latest')}
        {pill('trending', 'Trending')}
        {pill('following', 'Following')}
      </div>
      <div className="relative">
        <button
          onClick={() => setMoreOpen(o => !o)}
          className="px-3 py-2 text-sm rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
          aria-expanded={moreOpen}
          aria-haspopup="true"
        >
          More ▾
        </button>
        {moreOpen && (
          <div className="absolute z-20 mt-2 bg-white border rounded-md shadow p-2 grid grid-cols-2 gap-2 min-w-[220px]">
            <button
              className={`px-3 py-2 text-sm rounded ${!category ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              onClick={() => { clickCategory(null); setMoreOpen(false) }}
            >
              All
            </button>
            {EXTRA_CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`px-3 py-2 text-sm rounded ${category === cat ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                onClick={() => { clickCategory(cat); setMoreOpen(false) }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
