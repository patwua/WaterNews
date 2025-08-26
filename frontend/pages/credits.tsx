import Head from "next/head";
import SectionCard from "@/components/UX/SectionCard";
import { seoMetaTags } from "@/lib/seo";

interface CreditItem {
  name: string;
  url: string;
  via: string;
}

interface CreditGroup {
  group: string;
  items: CreditItem[];
}

const credits: CreditGroup[] = [
  {
    group: "Technologies",
    items: [
      { name: "Next.js", url: "https://nextjs.org", via: "Vercel" },
      { name: "Tailwind CSS", url: "https://tailwindcss.com", via: "Tailwind Labs" },
      { name: "TypeScript", url: "https://www.typescriptlang.org", via: "Microsoft" },
    ],
  },
  {
    group: "Photography",
    items: [
      { name: "Unsplash", url: "https://unsplash.com", via: "Unsplash contributors" },
      { name: "Pexels", url: "https://www.pexels.com", via: "Pexels community" },
    ],
  },
  {
    group: "News Organizations",
    items: [
      { name: "Associated Press", url: "https://apnews.com", via: "AP" },
      { name: "Reuters", url: "https://www.reuters.com", via: "Reuters" },
    ],
  },
];

export default function CreditsPage() {
  return (
    <>
      <Head>
        {seoMetaTags({
          title: "Credits — WaterNews",
          description:
            "Credits for technologies, photography, and news organizations used by WaterNews.",
        })}
      </Head>
      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="mb-8 text-4xl font-bold">Credits</h1>
        <div className="grid gap-6">
          {credits.map((group) => (
            <div key={group.group}>
              <SectionCard title={group.group}>
                <ul className="space-y-2 text-[15px] text-slate-700">
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {item.name}
                      </a>{" "}
                      via {item.via}
                    </li>
                  ))}
                </ul>
              </SectionCard>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
