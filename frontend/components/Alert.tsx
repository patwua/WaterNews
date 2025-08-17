export default function Alert({
  kind = "info",
  children,
}: {
  kind?: "info" | "success" | "warn" | "error";
  children: any;
}) {
  const cls =
    kind === "error"
      ? "bg-red-50 text-red-800 ring-red-200"
      : kind === "warn"
      ? "bg-amber-50 text-amber-900 ring-amber-200"
      : kind === "success"
      ? "bg-green-50 text-green-800 ring-green-200"
      : "bg-blue-50 text-blue-800 ring-blue-200";
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      aria-live={kind === "error" ? "assertive" : "polite"}
      className={`rounded-2xl px-3 py-2 text-sm ring-1 ${cls}`}
    >
      {children}
    </div>
  );
}
