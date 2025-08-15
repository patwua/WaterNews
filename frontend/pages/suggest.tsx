import { useState } from 'react'
export default function Suggest() {
  const [sent, setSent] = useState(false)
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-3xl font-bold">Suggest a Story</h1>
      {!sent ? (
        <form
          onSubmit={(e)=>{e.preventDefault(); setSent(true)}}
          className="space-y-3"
        >
          <input className="w-full border rounded px-3 py-2" placeholder="Your name (optional)" />
          <input className="w-full border rounded px-3 py-2" placeholder="Contact (email or phone)" />
          <textarea className="w-full border rounded px-3 py-2 h-32" placeholder="What happened? Add links if you have them." />
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
        </form>
      ) : (
        <div className="text-green-700">Thanks! We'll review your suggestion.</div>
      )}
    </div>
  )
}
