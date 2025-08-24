export const SUBJECTS = [
  { value: "tip",          label: "Send a Tip" },
  { value: "correction",   label: "Request a Correction" },
  { value: "suggest-story",label: "Suggest a Story" },
  { value: "apply",        label: "Apply to Contribute" },
  { value: "partnerships", label: "Partnerships & Advertising" },
  { value: "press",        label: "Press & Speaking" },
  { value: "careers",      label: "Careers" },
  { value: "general",      label: "General" },
];

export function routeSubject(subject) {
  switch (subject) {
    case "tip":
      return { queue: "tips", role: "Moderator", status: "new", priority: "high" };
    case "correction":
      return { queue: "corrections", role: "Editor", status: "new", priority: "high" };
    case "suggest-story":
      return { queue: "stories", role: "Editor", status: "new", priority: "normal" };
    case "apply":
      return { queue: "contributors", role: "Editor", status: "new", priority: "normal" };
    case "partnerships":
      return { queue: "ads", role: "Admin", status: "new", priority: "normal" };
    case "press":
      return { queue: "press", role: "Admin", status: "new", priority: "normal" };
    case "careers":
      return { queue: "careers", role: "Admin", status: "new", priority: "normal" };
    default:
      return { queue: "general", role: "Editor", status: "new", priority: "normal" };
  }
}
