import { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Login() {
  const { data: session } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login'|'register'>('login')
  const [err, setErr] = useState<string>('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    if (mode === 'register') {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const json = await res.json()
      if (!res.ok) return setErr(json.error || 'Registration failed')
      // auto sign-in after register
    }
    const res = await signIn('credentials', { email, password, redirect: true, callbackUrl: '/profile' })
    if (res?.error) setErr(res.error)
  }

  if (session?.user) {
    return (
      <div className="max-w-md mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">You’re signed in</h1>
        <div className="text-gray-700 text-sm">Signed in as {(session.user as any).email}</div>
        <div className="flex gap-4">
          <Link className="text-blue-700 underline" href="/profile">Go to Profile</Link>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="text-red-600 underline">Sign out</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Author {mode === 'login' ? 'Login' : 'Register'}</h1>
      {err && <div className="text-red-600 text-sm">{err}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">{mode === 'login' ? 'Sign in' : 'Create account'}</button>
      </form>
      <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-sm text-blue-700 underline">
        {mode === 'login' ? 'Create an author account' : 'I already have an account'}
      </button>
      <div className="pt-6">
        <Link href="/" className="text-blue-700 underline">← Back to Home</Link>
      </div>
    </div>
  )
}
