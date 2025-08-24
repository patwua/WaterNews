import BrandLogo from "@/components/BrandLogo";
import { colors } from "@/lib/brand-tokens";

export default function Page({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <header
        className="relative grid min-h-[40vh] place-items-center overflow-hidden px-4 text-center text-white"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${colors.brandBlue}, ${colors.brandBlueDark}, ${colors.brandBlueDarker})`,
        }}
      >
        <div className="mb-4 flex items-center justify-center">
          <BrandLogo variant="mark" width={48} height={48} />
        </div>
        <h1 className="m-0 text-3xl font-extrabold leading-tight md:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-2 font-serif text-base opacity-95 md:text-lg">{subtitle}</p>
        )}
        {actions && <div className="mt-4">{actions}</div>}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-50"
            style={{
              WebkitMask: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='200' viewBox='0 0 1600 200'><path d='M0 80 C 200 160, 400 0, 600 80 S 1000 160, 1200 80 S 1400 0, 1600 80 V200 H0 Z' fill='black'/></svg>") center/cover no-repeat`,
              mask: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='200' viewBox='0 0 1600 200'><path d='M0 80 C 200 160, 400 0, 600 80 S 1000 160, 1200 80 S 1400 0, 1600 80 V200 H0 Z' fill='black'/></svg>") center/cover no-repeat`,
              background:
                "radial-gradient(45% 80% at 30% 20%, rgba(255,255,255,.15), transparent 60%), linear-gradient(0deg, rgba(255,255,255,.15), rgba(255,255,255,0) 60%)",
            }}
          />
      </header>
      <main className="max-w-5xl mx-auto -mt-14 mb-16 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </>
  );
}
