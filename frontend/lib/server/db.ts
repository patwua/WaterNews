import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL || "";

if (!MONGODB_URI) {
  // Non-fatal log; API routes will throw if called.
  console.warn("⚠️  MONGODB_URI is not set");
}

let cached = (global as any).db || { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    // Loosen option typing to keep typecheck green without Mongoose types
    cached.promise = mongoose
      .connect(MONGODB_URI, { dbName: process.env.MONGODB_DB || "patwua" } as any)
      .then((m) => m);
  }
  cached.conn = await cached.promise;
  (global as any).db = cached;
  return cached.conn;
}
