import Redis from 'ioredis';

interface RedisCacheInterface {
  get(key: string): Promise<any>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  mget(keys: string[]): Promise<any[]>;
  mset(keyValuePairs: Array<{ key: string; value: any }>, ttl: number): Promise<void>;
}

export class RedisCache implements RedisCacheInterface {
  private client: Redis;

  constructor() {
    this.client = new Redis();
  }

  async get(key: string): Promise<any> {
    const value = await this.client.get(key);
    return JSON.parse(value!);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await this.client.setex(key, ttl, stringValue);
    } else {
      await this.client.set(key, stringValue);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async mget(keys: string[]): Promise<any[]> {
    const values = await this.client.mget(...keys);
    return values.map((value) => JSON.parse(value!));
  }

  async mset(
    keyValuePairs: Array<{ key: string; value: any }>,
    ttl: string | number
  ): Promise<void> {
    const pipeline = this.client.pipeline();
    keyValuePairs.forEach(({ key, value }) => {
      const stringValue = JSON.stringify(value);
      pipeline.setex(key, ttl, stringValue);
    });
    await pipeline.exec();
  }
}
