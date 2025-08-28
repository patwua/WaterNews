import { withCloudinaryAuto } from "@/lib/media";

export const aboutCopy = {
  hero: {
    title: "About WaterNews",
    subtitle: "Dive Into Current Stories — giving Guyanese, Caribbean, and diaspora voices a modern platform.",
  },
  mission: {
    tag: "Our Mission",
    headline: "Empower Our Communities with Truth",
    body: "We deliver authentic, fact-checked news and engaging features that connect the Caribbean and its diaspora — from Georgetown to New York, Toronto and beyond.",
    bullets: [
      "✅ Reliable reporting across current events, politics, economy",
      "✅ Opinion & Letters inviting debate and diverse perspectives",
      "✅ Lifestyle features celebrating culture, food, and everyday life",
    ],
    ctas: [
      { label: "Apply to Contribute", href: "/contact?subject=apply", type: "primary" },
      { label: "Suggest a Story", href: "/contact?subject=suggest-story", type: "secondary" },
    ],
  },
  whoWeAre: {
    title: "Who We Are",
    paragraphs: [
      "Stories travel like waves — they echo from the coastlines of Guyana across the Caribbean and through diaspora communities worldwide. WaterNews captures those waves with clarity and context, keeping our readers informed and connected.",
      "Built by journalists and technologists from the region and its diaspora, we're independent, community-rooted, and driven by a commitment to verified reporting and cultural pride.",
    ],
  },
  diaspora: {
    title: "Diaspora & International",
    body: "Guyana’s story extends beyond its borders. We examine remittances, migration, climate, culture, and policy as they flow between Georgetown and the diaspora. When global headlines hit home, we explain the why—not just the what. From Brooklyn and Toronto to London, see how the world touches Guyanese life.",
    image: {
      src: "/brand/diaspora-card.png",
      alt: "Collage of Guyanese diaspora",
      width: 1536,
      height: 1024,
    },
  },
  publish: {
    title: "What We Publish",
    subtitle: "News articles, opinion letters, and lifestyle features designed for engagement and credibility.",
    types: [
      {
        t: "News",
        d: "Reporting on national and regional events, policy, economy, and public interest issues that matter now.",
      },
      {
        t: "Opinions & Letters",
        d: "Well-argued perspectives that challenge, explain, and invite constructive debate from our community.",
      },
      {
        t: "Lifestyle",
        d: "Culture, food, fashion, and everyday life — the rhythms that shape who we are.",
      },
    ],
  },
  values: {
    title: "Our Values",
    subtitle: "Truth first. Community voice. Cultural pride. Modern storytelling.",
    items: [
      { t: "Truth First", d: "We verify sources, correct mistakes, and prioritize accuracy over virality." },
      { t: "Community Voice", d: "We make space for letters and perspectives across the Caribbean and diaspora." },
      { t: "Cultural Pride", d: "We highlight stories that honor our heritage, creativity, and diversity." },
    ],
  },
  leadershipHighlights: {
    tag: "Leadership",
    title: "Strategy, stewardship, and standards",
    subtitle: "Meet the team responsible for the mission, technology and sustainability of WaterNewsGY.",
    people: [
      {
        name: "Tatiana Chow",
        title: "Publisher & CEO — Editor in Chief",
        photo: withCloudinaryAuto(
          "https://res.cloudinary.com/dpdhi4joq/image/upload/v1755882163/file_00000000eaf461f88c63fecb72905946_qmoqor.png"
        ),
        bio: "Tatiana sets the editorial bar and keeps the mission honest. She blends newsroom discipline with a builder’s instinct: fast when needed, patient when it matters.",
      },
      {
        name: "Dwuane Adams",
        title: "CTO — Co‑founder",
        photo: withCloudinaryAuto(
          "https://res.cloudinary.com/dpdhi4joq/image/upload/v1755961624/file_0000000084bc61fb9c2f1f0e1c239ffa_shstq4.png"
        ),
        bio: "Jamaican-born to Guyanese parents. Outdoors and adventure junkie; computer-science geek and serial entrepreneur by career. He builds the systems that make our journalism nimble and secure.",
      },
      {
        name: "Sherman Rodriguez",
        title: "CFO",
        photo: withCloudinaryAuto(
          "https://res.cloudinary.com/dpdhi4joq/image/upload/v1755882130/file_0000000001e861f8a8db16bf20e9d1c8_yju42z.png"
        ),
        bio: "American, Guyanese father. Finance, travel, culture and lifestyle nerd. He keeps the numbers honest so the reporting can be fearless.",
      },
    ],
    cta: "Meet the full leadership",
  },
  masthead: {
    image: {
      src: "/brand/diaspora-card.png",
      alt: "Diaspora card",
      width: 220,
      height: 220,
    },
    title: "Masthead & News Team",
    paragraphs: [
      "Editors, reporters, and contributors from across Guyana, the Caribbean, and the diaspora power every WaterNews story. Explore the newsroom directory to learn about their beats, bios, and latest work.",
    ],
    findTitle: "What you'll find",
    findItems: [
      "Author directory with beats and bios",
      "Transparency on corrections and updates",
      "Diaspora touch across regions and abroad",
      "Profile photos & badges identifying roles",
    ],
    reachPrompt: {
      before: "Want to reach us? Use the ",
      linkLabel: "contact page",
      after: " to connect directly.",
    },
    cta: "Meet the News-Team",
  },
  standards: {
    title: "Editorial Standards & Fact-Check Policy",
    intro: "WaterNews follows a clear set of editorial practices to keep our reporting accurate, fair, and independent. We vet sources, provide context, and publish corrections when we fall short.",
    bullets: [
      {
        label: "Sourcing",
        text: "Prefer on-the-record sources, public documents, and data. Anonymous sources are used sparingly with editor approval.",
      },
      {
        label: "Verification",
        text: "Names, titles, dates, locations, and figures are verified prior to publication. Hyperlinks and citations are included where practical.",
      },
      {
        label: "Right of Reply",
        text: "Subjects of critical coverage are given reasonable time to respond.",
      },
      {
        label: "Conflicts",
        text: "Reporters disclose potential conflicts; assignments can be reassigned if necessary.",
      },
      {
        label: "Images",
        text: "Photos and graphics should not materially alter reality; edits are limited to basic color/size/crop.",
      },
      {
        label: "AI Use",
        text: "We may use AI for drafting or summarization; editors review all output for accuracy and tone before publishing.",
      },
    ],
    factCheck: {
      title: "Fact-Check Workflow",
      steps: [
        "Reporter drafts story with citations and supporting materials.",
        "Section editor (or EIC) verifies key facts, quotes, names, dates.",
        "If sensitive or contested, we seek an additional independent source.",
        "Story is approved for publication with an audit note in the CMS.",
      ],
    },
    corrections: {
      title: "Corrections",
      text: "If we publish an error, we will correct it promptly and add a note indicating what changed. Use the link below to request a correction.",
      linkText: "Request a Correction",
    },
  },
  reachUs: {
    title: "How to reach us",
    desc: "Whether you're pitching a feature, flagging a typo, or exploring a partnership, we're just a click away. Choose a link below to reach the right team.",
    contacts: [
      { label: "Send a Tip", token: "tip", desc: "Know something we should report?" },
      { label: "Request a Correction", token: "correction", desc: "Spotted an error? Let us know." },
      { label: "Suggest a Story", token: "suggest-story", desc: "Have an idea for us?" },
      { label: "Apply to Contribute", token: "apply", desc: "Join our contributor network." },
      { label: "Partnerships & Advertising", token: "partnerships", desc: "Work with WaterNews." },
      { label: "Press & Speaking", token: "press", desc: "Reach out to our press team." },
      { label: "Careers", token: "careers", desc: "Work with us." },
    ],
    note: "Privacy note: We respect your privacy and local laws.",
  },
} as const;

export type AboutCopy = typeof aboutCopy;
export default aboutCopy;

