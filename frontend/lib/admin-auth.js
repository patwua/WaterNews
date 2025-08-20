export async function isAdminEmail(email) {
  if (!email) return false;
  const env = process.env.ADMIN_EMAILS || "";
  const list = env.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  return list.includes(email.toLowerCase());
}

// Optional DB role check (call this server-side in getServerSideProps / API)
import { getDb } from "./db";
export async function isAdminUser(email) {
  if (!email) return false;
  const db = await getDb();
  if (!db) return false;
  const user = await db.collection("users").findOne({ email: email.toLowerCase() }, { projection: { role: 1 } });
  return !!user && (user.role === "admin" || user.role === "editor" || user.role === "moderator");
}
