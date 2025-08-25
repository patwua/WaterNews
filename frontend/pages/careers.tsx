import Head from "next/head";
import Link from "next/link";
import SectionCard from "@/components/UX/SectionCard";
import { colors } from "@/lib/brand-tokens";

export default function CareersPage() {
  return (
    <>
      <Head>
        <title>Careers — WaterNews</title>
        <meta name="description" content="Join the WaterNews team." />
      </Head>
      <header
        className="relative grid min-h-[40vh] place-items-center overflow-hidden px-4 pt-16 text-center text-white"
        style={{ backgroundImage: `linear-gradient(to bottom, ${colors.brandBlue}, ${colors.brandBlueDark}, ${colors.brandBlueDarker})` }}
      >
        <h1 className="text-4xl font-extrabold">Careers</h1>
      </header>
      <main className="mx-auto -mt-12 mb-16 max-w-4xl px-4">
        <SectionCard className="mb-8">
          <p className="text-[15px] text-slate-700">
            We're growing a network of writers, editors, and technologists. Current openings are listed below.
          </p>
        </SectionCard>
        <SectionCard>
          <h2 className="text-xl font-bold">Open Roles</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-[15px] text-slate-700">
            <li>News Reporter (freelance)</li>
            <li>Opinion Editor (part-time)</li>
          </ul>
          <p className="mt-4 text-[15px] text-slate-700">
            Interested? Send your details through our contact form.
          </p>
          <Link href="/contact?subject=careers" className="mt-4 inline-block rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white">
            Apply via Contact
          </Link>
        </SectionCard>
      </main>
      <footer className="px-4 py-16 text-center text-slate-500">
        <div>&copy; {new Date().getFullYear()} WaterNews — All rights reserved.</div>
      </footer>
    </>
  );
}
