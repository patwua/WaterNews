export const SUBJECTS = [
  { value: "tip",         label: "News Tip" },
  { value: "correction",  label: "Correction Request" },
  { value: "apply",       label: "Apply to Contribute" },
  { value: "advertising", label: "Advertising / Partnerships" },
  { value: "general",     label: "General Contact" },
];

export function routeSubject(subject) {
  switch (subject) {
    case "tip":         return { queue: "tips",         role: "Moderator", status: "new", priority: "high" };
    case "correction":  return { queue: "corrections",  role: "Editor",    status: "new", priority: "high" };
    case "apply":       return { queue: "applications", role: "Editor",    status: "new", priority: "normal" };
    case "advertising": return { queue: "ads",          role: "Admin",     status: "new", priority: "normal" };
    default:            return { queue: "general",      role: "Editor",    status: "new", priority: "normal" };
  }
}
