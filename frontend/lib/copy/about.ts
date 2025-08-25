export const aboutCopy = {
  hero: {
    title: "About WaterNews",
    subtitle: "Dive Into Current Stories — giving Guyanese, Caribbean, and diaspora voices a modern platform.",
  },
  mission: {
    tag: "Our Mission",
    title: "Empower Our Communities with Truth & Story",
    blurb:
      "We deliver authentic, fact-checked news and engaging features that connect the Caribbean and its diaspora — from Georgetown to New York, Toronto and beyond.",
    bullets: [
      "✅ Reliable reporting across current events, politics, economy",
      "✅ Opinion & Letters inviting debate and diverse perspectives",
      "✅ Lifestyle features celebrating culture, food, and everyday life",
    ],
    ctas: [
      { label: "Apply to Contribute", href: "/contact?subject=apply" },
      { label: "Suggest a Story", href: "/contact?subject=suggest-story" },
    ],
  },
  whoWeAre: {
    title: "Who We Are",
    body: [
      "Stories travel like waves — they echo from the coastlines of Guyana across the Caribbean and through diaspora communities worldwide. WaterNews captures those waves with clarity and context, keeping our readers informed and connected.",
      "Built by journalists and technologists from the region and its diaspora, we're independent, community-rooted, and driven by a commitment to verified reporting and cultural pride.",
    ],
  },
  diaspora: {
    title: "Diaspora & International",
    body: "From Brooklyn and Toronto to London, we highlight how regional and global stories ripple across Guyanese lives.",
  },
  publish: {
    title: "What We Publish",
    blurb: "News articles, opinion letters, and lifestyle features designed for engagement and credibility.",
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
    blurb: "Truth first. Community voice. Cultural pride. Modern storytelling.",
    list: [
      {
        t: "Truth First",
        d: "We verify sources, correct mistakes, and prioritize accuracy over virality.",
      },
      {
        t: "Community Voice",
        d: "We make space for letters and perspectives across the Caribbean and diaspora.",
      },
      {
        t: "Cultural Pride",
        d: "We highlight stories that honor our heritage, creativity, and diversity.",
      },
    ],
  },
  leadershipHighlights: {
    title: "Leadership",
    cta: { label: "Full leadership", href: "/about/leadership" },
    people: [
      {
        name: "Tatiana Chow",
        title: "Publisher & CEO / Editor in Chief",
        photo:
          "https://res.cloudinary.com/dpdhi4joq/image/upload/v1755882163/file_00000000eaf461f88c63fecb72905946_qmoqor.png",
        bio: "Guides WaterNews with a focus on rigorous, community-rooted journalism.",
      },
      {
        name: "Dwuane Adams",
        title: "CTO / Co-founder",
        photo:
          "https://res.cloudinary.com/dpdhi4joq/image/upload/v1755961624/file_0000000084bc61fb9c2f1f0e1c239ffa_shstq4.png",
        bio: "Jamaican-born technologist building fast, safe systems for storytelling.",
      },
      {
        name: "Sherman Rodriguez",
        title: "CFO",
        photo:
          "https://res.cloudinary.com/dpdhi4joq/image/upload/v1755882130/file_0000000001e861f8a8db16bf20e9d1c8_yju42z.png",
        bio: "Keeps budgets honest and partnerships viable for our mission.",
      },
    ],
  },
  masthead: {
    title: "Masthead & News Team",
    blurb: "Find editors, reporters, and contributors. Search and paging available.",
    cta: { label: "Meet the News Team", href: "/about/masthead" },
  },
  reachUs: {
    title: "How to reach us",
    blurb:
      "Whether you're pitching a feature, flagging a typo, or exploring a partnership, we're just a click away. Choose a link below to reach the right team.",
    contacts: [
      { label: "Send a Tip", token: "tip" },
      { label: "Request a Correction", token: "correction" },
      { label: "Suggest a Story", token: "suggest-story" },
      { label: "Apply to Contribute", token: "apply" },
      { label: "Partnerships & Advertising", token: "partnerships" },
      { label: "Press & Speaking", token: "press" },
      { label: "Careers", token: "careers" },
    ],
  },
} as const;

export type AboutCopy = typeof aboutCopy;
export default aboutCopy;
