import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL || "";

if (!MONGODB_URI) {
  // Non-fatal log; API routes will throw if called.
  console.warn("⚠️  MONGODB_URI is not set");
}

let cached = (global as any)._mongooseCached;
if (!cached) {
  cached = (global as any)._mongooseCached = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { dbName: process.env.MONGODB_DB || "patwua" })
      .then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
