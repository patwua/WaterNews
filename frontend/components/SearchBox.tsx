import { useState, useRef, useEffect } from "react";

export default function SearchBox() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <div className="relative">
      {/* Icon button triggers expansion */}
      <button
        type="button"
        aria-label="Open search"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center rounded-md p-2 hover:bg-neutral-100"
      >
        🔎
      </button>
      <form action="/search" className="absolute right-0 top-1/2 -translate-y-1/2">
        <input
          ref={inputRef}
          name="q"
          placeholder="Search"
          className={[
            "rounded-md border px-3 py-2 text-sm outline-none transition-all",
            open ? "w-64 opacity-100 shadow" : "w-0 opacity-0 pointer-events-none",
          ].join(" ")}
          onBlur={() => setOpen(false)}
        />
      </form>
    </div>
  );
}

