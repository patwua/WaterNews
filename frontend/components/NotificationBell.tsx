import { useEffect, useState } from 'react'
import { BellIcon } from './icons'

export default function NotificationBell() {
  const [following, setFollowing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const v = localStorage.getItem('wn_following')
      setFollowing(v === 'true')
    } catch {}
  }, [])

  const toggle = () => {
    const next = !following
    setFollowing(next)
    try { localStorage.setItem('wn_following', String(next)) } catch {}
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggle}
      className="p-2 rounded border border-gray-300 hover:bg-gray-100"
      aria-label={following ? 'Following notifications' : 'Follow updates'}
      title={following ? 'Following updates' : 'Follow updates'}
    >
      <BellIcon className="w-5 h-5" />
    </button>
  )
}
