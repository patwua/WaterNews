import { MongoClient, Db } from "mongodb";
let client: MongoClient | null = null;
export async function getDb(): Promise<Db | null> {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) return null;
  if (!client) client = await MongoClient.connect(uri);
  return client.db(process.env.MONGO_DB || "waternews");
}
