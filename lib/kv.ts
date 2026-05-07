import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return _redis;
}

export async function getContent<T>(key: string, fallback: T): Promise<T> {
  const redis = getRedis();
  if (!redis) return fallback;
  try {
    const data = await redis.get<T>(key);
    return data ?? fallback;
  } catch {
    return fallback;
  }
}

export async function setContent<T>(key: string, value: T): Promise<void> {
  const redis = getRedis();
  if (!redis) throw new Error("KV_NOT_CONFIGURED");
  await redis.set(key, value);
}
