import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

type MenuKey = 'latest' | 'trending' | 'following'

/**
 * Pill-style smart menu:
 * - Grey rounded container
 * - Active pill: white bg + blue text + subtle shadow
 * - Emits a 'wn-menu-change' CustomEvent with the selected key
 * - Syncs with URL query (?sort=latest|trending|following)
 */
export default function SmartMenu() {
  const router = useRouter()
  const initial = (router.query.sort as string) as MenuKey
  const [active, setActive] = useState<MenuKey>(initial || 'latest')

  useEffect(() => {
    // keep in sync if URL changes via back/forward
    const q = (router.query.sort as string) as MenuKey
    if (q && q !== active) setActive(q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.sort])

  const click = (key: MenuKey) => {
    setActive(key)
    // push to URL shallowly
    router.replace(
      { pathname: router.pathname, query: { ...router.query, sort: key } },
      undefined,
      { shallow: true }
    )
    // broadcast to listeners (homepage) to update feed ordering
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('wn-menu-change', { detail: key }))
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
    <div className="flex bg-gray-100 rounded-full p-1">
      {pill('latest', 'Latest')}
      {pill('trending', 'Trending')}
      {pill('following', 'Following')}
    </div>
  )
}
