import Link from 'next/link'
export default function Login() {
  return (
    <div className="max-w-md mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Author Login</h1>
      <p className="text-gray-700">
        Author accounts coming soon. You’ll be able to sign in, manage your profile & bio,
        and publish stories via a professional editor.
      </p>
      <div className="text-sm text-gray-500">
        Want early access? <a className="text-blue-700 underline" href="/contact">Contact us</a>.
      </div>
      <div className="pt-6">
        <Link href="/" className="text-blue-700 underline">← Back to Home</Link>
      </div>
    </div>
  )
}
