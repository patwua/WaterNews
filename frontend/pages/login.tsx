import { useEffect, useId, useState, type FormEvent } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Login() {
  const { data: session, status } = useSession()

  const [mode, setMode] = useState<'login'|'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [err, setErr] = useState<string>('')

  const emailId = useId()
  const pwId = useId()
  const errId = useId()

  useEffect(() => setErr(''), [mode])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErr('')

    if (mode === 'register') {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        const json = await res.json()
        if (!res.ok) return setErr(json?.error || 'Registration failed')
      } catch {
        return setErr('Network error during registration')
      }
    }

    const res = await signIn('credentials', {
      email,
      password,
      redirect: true,
      callbackUrl: '/profile'
    })

    // next-auth returns an object with error in some cases
    if ((res as any)?.error) setErr((res as any).error)
  }

  if (status === 'loading') {
    return (
      <main className="max-w-md mx-auto p-6">
        <div className="h-40 rounded-2xl bg-neutral-200 animate-pulse" />
      </main>
    )
  }

  if (session?.user) {
    return (
      <main className="max-w-md mx-auto p-6">
        <div className="rounded-2xl ring-1 ring-black/5 bg-white p-6">
          <h1 className="text-2xl font-semibold">You’re signed in</h1>
          <p className="text-sm text-neutral-700 mt-1">Signed in as {(session.user as any).email}</p>
          <div className="mt-4 flex gap-2">
            <Link
              href="/profile"
              className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
            >
              Go to Profile
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium bg-white ring-1 ring-black/10 hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 text-red-700"
            >
              Sign out
            </button>
          </div>
        </div>
        <div className="mt-4">
          <Link href="/" className="text-blue-700 underline">← Back to Home</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <div className="rounded-2xl ring-1 ring-black/5 bg-white p-6">
        <h1 className="text-2xl font-semibold">Author {mode === 'login' ? 'Login' : 'Register'}</h1>
        <p className="text-sm text-neutral-600 mt-1">
          Readers don’t need an account. Authors sign in to create and publish.
        </p>

        {err && (
          <div
            id={errId}
            role="alert"
            className="mt-3 rounded-lg bg-red-50 text-red-800 text-sm px-3 py-2 ring-1 ring-red-200"
          >
            {err}
          </div>
        )}

        <form className="mt-4 space-y-3" onSubmit={onSubmit} noValidate>
          <div>
            <label htmlFor={emailId} className="block text-sm font-medium">
              Email <span aria-hidden="true" className="text-red-600">*</span>
              <span className="sr-only">required</span>
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(err)}
              aria-describedby={err ? errId : undefined}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor={pwId} className="block text-sm font-medium">
              Password <span aria-hidden="true" className="text-red-600">*</span>
              <span className="sr-only">required</span>
            </label>
            <div className="mt-1 flex rounded-lg border overflow-hidden focus-within:ring-2 focus-within:ring-neutral-500">
              <input
                id={pwId}
                name="password"
                type={showPw ? 'text' : 'password'}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 outline-none"
                placeholder={mode === 'login' ? 'Your password' : 'Create a password'}
                aria-invalid={Boolean(err)}
                aria-describedby={err ? errId : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPw(s => !s)}
                className="px-3 text-sm text-neutral-700 hover:bg-neutral-50"
                aria-pressed={showPw}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
            {mode === 'register' && (
              <p className="mt-1 text-xs text-neutral-600">
                Tip: Use a strong phrase; you’ll see any server-side requirements if they apply.
              </p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
            >
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </button>

            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-sm text-blue-700 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 rounded"
            >
              {mode === 'login' ? 'Create an author account' : 'I already have an account'}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-4">
        <Link href="/" className="text-blue-700 underline">← Back to Home</Link>
      </div>
    </main>
  )
}

