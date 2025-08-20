import { MongoClient } from "mongodb";
let client;
export async function getDb() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) return null;
  if (!client) client = await MongoClient.connect(uri);
  return client.db(process.env.MONGO_DB || "waternews");
}
