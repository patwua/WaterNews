export const contactCopy = {
  shared: {
    hero: {
      title: "Contact WaterNews",
      subtitle: "We read every message.",
    },
    labels: {
      subject: "Subject",
      name: "Your name",
      email: "Email",
    },
    actions: {
      send: "Send",
      sending: "Sending…",
    },
    toasts: {
      success: "Thank you — submitted.",
      error: "Something went wrong.",
    },
    tips: {
      privacyLink: "Privacy Policy",
    },
  },
  tip: {
    hero: {
      title: "Send a Tip",
      subtitle: "Know something we should report?",
    },
    guidance: [
      "Share as much detail as you can.",
      "We may contact you for verification.",
    ],
    success: { detail: "Tip received." },
    error: { detail: "Failed to send tip." },
    meta: {
      anonymousReassure: "We never publish your name without permission.",
      uploadNote: "Attachments are encrypted and reviewed by editors.",
      privacyShort: "We use your info only to follow up on tips.",
    },
    fieldsets: [
      { name: "message", label: "Message", type: "textarea", required: true },
      { name: "location", label: "Location", type: "text" },
      { name: "datetime", label: "Date & Time", type: "text" },
      { name: "caption", label: "What we're seeing", type: "text" },
      { name: "media", label: "Media", type: "file", multiple: true },
      { name: "anonymous", label: "Send anonymously", type: "checkbox" },
    ],
  },
  correction: {
    hero: {
      title: "Request a Correction",
      subtitle: "Spotted an error? Let us know.",
    },
    guidance: ["Include the article URL for review."],
    success: { detail: "Correction request sent." },
    error: { detail: "Failed to send correction request." },
    meta: {
      privacyShort: "We only use your info to follow up on corrections.",
    },
    fieldsets: [
      { name: "article", label: "Article URL", type: "text", required: true },
      { name: "quote", label: "Line or quote in question", type: "text" },
      { name: "message", label: "Your correction", type: "textarea", required: true },
      { name: "media", label: "Attachments", type: "file", multiple: true },
    ],
  },
  "suggest-story": {
    hero: {
      title: "Suggest a Story",
      subtitle: "Have an idea for us?",
    },
    guidance: ["Community stories are always welcome."],
    success: { detail: "Story suggestion sent." },
    error: { detail: "Failed to send story suggestion." },
    meta: {
      privacyShort: "We only use your info to follow up on this suggestion.",
    },
    fieldsets: [
      { name: "summary", label: "Summary", type: "textarea", required: true },
      { name: "people", label: "People involved", type: "text" },
      { name: "links", label: "Links / references", type: "text" },
      { name: "anonymous", label: "Send anonymously", type: "checkbox" },
    ],
  },
  apply: {
    hero: {
      title: "Apply to Contribute",
      subtitle: "Join our contributor network.",
    },
    guidance: [],
    success: { detail: "Application submitted." },
    error: { detail: "Failed to submit application." },
    meta: {
      privacyShort: "We use your info only for contributor applications.",
    },
    fieldsets: [
      { name: "bio", label: "Bio", type: "textarea" },
      { name: "beats", label: "Beats / interests", type: "text" },
      { name: "links", label: "Clips / links", type: "text" },
      { name: "cv", label: "CV upload", type: "file" },
    ],
  },
  partnerships: {
    hero: {
      title: "Partnerships & Advertising",
      subtitle: "Work with WaterNews.",
    },
    guidance: [],
    success: { detail: "Message sent." },
    error: { detail: "Failed to send message." },
    meta: {
      privacyShort: "We only use your info for partnership discussions.",
    },
    fieldsets: [
      { name: "org", label: "Organization", type: "text" },
      { name: "website", label: "Website", type: "text" },
      { name: "goals", label: "Campaign goals", type: "textarea" },
      { name: "timeline", label: "Timeline", type: "text" },
      { name: "budget", label: "Budget range", type: "text" },
    ],
  },
  press: {
    hero: {
      title: "Press & Speaking",
      subtitle: "Reach out to our press team.",
    },
    guidance: [],
    success: { detail: "Message sent." },
    error: { detail: "Failed to send message." },
    meta: {
      privacyShort: "We only use your info to respond to press inquiries.",
    },
    fieldsets: [
      { name: "outlet", label: "Outlet", type: "text" },
      { name: "topic", label: "Topic", type: "text" },
      { name: "deadline", label: "Deadline", type: "text" },
      { name: "format", label: "Format", type: "text" },
      { name: "links", label: "Links", type: "text" },
    ],
  },
  careers: {
    hero: {
      title: "Careers",
      subtitle: "Work with us.",
    },
    guidance: [],
    success: { detail: "Application sent." },
    error: { detail: "Failed to send application." },
    meta: {
      privacyShort: "We use your info only for recruiting purposes.",
    },
    fieldsets: [
      { name: "role", label: "Role of interest", type: "text" },
      { name: "experience", label: "Experience", type: "textarea" },
      { name: "links", label: "Links", type: "text" },
      { name: "cv", label: "CV upload", type: "file" },
    ],
  },
  general: {
    hero: {
      title: "Contact WaterNews",
      subtitle: "We read every message.",
    },
    guidance: [],
    success: { detail: "Message sent." },
    error: { detail: "Failed to send message." },
    meta: {
      privacyShort: "We only use your info to reply.",
    },
    fieldsets: [{ name: "message", label: "Message", type: "textarea", required: true }],
  },
} as const;

export type ContactCopy = typeof contactCopy;
export default contactCopy;
