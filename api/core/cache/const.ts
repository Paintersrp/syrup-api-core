export const CACHE = {
  OPTIONS: {
    defaultTTL: 30000,
    maxCacheSize: 200,
    evictInterval: 30000,
    earlyExpirationProbablity: 0.5,
    earlyExpirationWindow: 0.2,
  },
  ALERTS: {
    minHitRatio: 0.8,
    maxEvictions: 100,
  },
};
