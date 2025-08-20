import { useEffect, useState } from "react";
export default function Toast({ message, type = "success", onDone }) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => {
      setOpen(false);
      onDone?.();
    }, 3000);
    return () => clearTimeout(t);
  }, []);
  if (!open) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`px-4 py-3 rounded-lg shadow text-white ${type === "error" ? "bg-red-600" : "bg-green-600"}`}>
        {message}
      </div>
    </div>
  );
}
