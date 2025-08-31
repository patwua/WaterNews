import { getDb } from './db';

export async function getTrendingCache(hours: number) {
  const db = await getDb();
  const doc = await db.collection('streams_trending_cache').findOne({ hours });
  return doc as (null | { hours: number; slugs: string[]; updatedAt: number });
}

export async function setTrendingCache(hours: number, slugs: string[]) {
  const db = await getDb();
  const updatedAt = Date.now();
  await db.collection('streams_trending_cache').updateOne(
    { hours },
    { $set: { hours, slugs, updatedAt } },
    { upsert: true }
  );
  return { hours, slugs, updatedAt };
}
