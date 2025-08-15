import { useEffect, useState } from 'react'

export default function FollowButton() {
  const [following, setFollowing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const v = window.localStorage.getItem('wn_following')
      setFollowing(v === 'true')
    } catch {}
  }, [])

  const toggle = () => {
    const next = !following
    setFollowing(next)
    try { window.localStorage.setItem('wn_following', String(next)) } catch {}
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggle}
      className="text-sm px-3 py-1 rounded border border-blue-600 text-blue-600 hover:bg-blue-50"
      aria-label={following ? 'Following WaterNews' : 'Follow WaterNews'}
      title={following ? 'Following WaterNews' : 'Follow WaterNews'}
    >
      {following ? '🔔' : 'Follow'}
    </button>
  )
}
