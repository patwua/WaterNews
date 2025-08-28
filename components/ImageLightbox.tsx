import { useEffect, useRef } from "react";

export default function ImageLightbox({
  src,
  alt = "",
  onClose,
}: {
  src: string;
  alt?: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on ESC; focus the dialog for SR/keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    ref.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Image viewer"}
      tabIndex={-1}
      ref={ref}
      className="fixed inset-0 z-[1000] bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Stop propagation so clicks on the image don't close unless clicking backdrop */}
      <div className="max-w-5xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[90vh] rounded-xl shadow-lg"
        />
        <div className="mt-2 text-center">
          <button
            type="button"
            className={
              "inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium bg-white ring-1 ring-black/10 " +
              "hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
            }
            onClick={onClose}
          >
            Close (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}

