import { MongoClient } from "mongodb";

/**
 * Tiny Mongo helper used by the contact/apply/corrections APIs.
 *
 * Gracefully returns null if no URI is present so routes can still 200.
 */
let client;
let db;

export async function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  if (!client) {
    client = new MongoClient(uri, { ignoreUndefined: true });
    await client.connect();
  }
  if (!db) {
    db = client.db(process.env.MONGODB_DB || "waternews");
  }
  return db;
}

