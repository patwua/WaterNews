import { useEffect, useRef, useState } from "react";

type Props = {
  /** "inline" keeps the input in the header and expands its width on focus/click. */
  mode?: "default" | "inline";
};

export default function SearchBox({ mode = "default" }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const inline = mode === "inline";

  useEffect(() => {
    if (open && inline && ref.current) ref.current.focus();
  }, [open, inline]);

  if (inline) {
    return (
      <form role="search" className="group relative hidden items-center md:flex">
        <label htmlFor="header-search" className="sr-only">
          Search
        </label>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-3 text-slate-500 dark:text-slate-400"
        >
          <path
            fill="currentColor"
            d="M21 20.3l-4.3-4.3a7.5 7.5 0 10-1.4 1.4L19.6 22 21 20.3zM4 10.5A6.5 6.5 0 1117 10.5 6.5 6.5 0 014 10.5z"
          />
        </svg>
        <input
          id="header-search"
          ref={ref}
          type="search"
          aria-label="Search WaterNews"
          placeholder="Search WaterNews"
          className="w-32 md:w-40 lg:w-48 xl:w-56 transition-[width] duration-200 focus:w-60 md:focus:w-72 lg:focus:w-96 rounded-full border border-slate-300/70 bg-white pl-9 pr-3 py-1.5 text-sm outline-none ring-0 placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 dark:border-slate-700/70 dark:bg-slate-900"
          value={q}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onChange={(e) => setQ(e.target.value)}
        />
      </form>
    );
  }

  // default (full input used on /search page)
  return (
    <form role="search" className="flex items-center gap-2">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        id="search"
        type="search"
        aria-label="Search WaterNews"
        placeholder="Search WaterNews"
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
    </form>
  );
}

