export const CacheSystemResponses = {
  CACHE_HIT: (key: string) => `Cache hit for key ${key}`,
  CACHE_MISS: (key: string) => `Cache miss for key ${key}`,
  CACHE_UPDATE: (key: string) => `Cache updated for key ${key}`,
  CACHE_DELETE: (key: string) => `Cache deleted for key ${key}`,
};
