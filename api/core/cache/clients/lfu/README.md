# SyLFUCache

SyLFUCache is a high-performance, flexible, and robust Least Frequently Used (LFU) cache implementation backed by Sequelize ORM for Node.js applications, especially designed for the Koa web framework. It offers an efficient LFU eviction policy and several key-value store methods. The cache implementation has a built-in mechanism for the eviction of expired items, and supports probabilistic early expiration of cached items.

#

## Table of Contents

- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)

#

## Usage

Here is an example of using the `SyLFUCache` to cache responses from a REST API endpoint. The example creates a Koa server that listens for `GET` requests at the `/data/:id` route. If the requested data is already in the cache, the server responds with the cached data. If not, it fetches the data from a remote server, stores the result in the cache, and then responds with the data.

Create the Sequelize instance, the `SyLogger`, and the `SyLFUCache`:

```javascript
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres',
});

const logger = new SyLogger();

const cache = new SyLFUCache(sequelize, logger, {
  maxCacheSize: 100,
  defaultTTL: 5 * 60 * 1000, // 5 minutes
});
```

Create the Koa application and the router:

```javascript
const app = new Koa();
const router = new Router();
```

Set up the route:

```javascript
router.get('/data/:id', async (ctx) => {
  const id = ctx.params.id;
  let data = cache.get(id);

  if (!data) {
    const response = await axios.get(`https://example.com/data/${id}`);
    data = response.data;
    cache.set(id, data);
  }

  ctx.body = data;
});
```

Apply the router middleware and start the server:

```javascript
app.use(router.routes());
app.listen(3000);
```

#

## API Documentation

### `set(key: number, value: any, ttl?: number)`

Sets a new item in the cache, or updates the value and TTL of an existing item.

```javascript
cache.set(id, data, 1000);
```

### `mset(items: Array<{ key: number; value: any }>, ttl?: number)`

Sets multiple items in the cache at once.

```javascript
cache.mset(
  [
    { key: 1, value: data1 },
    { key: 2, value: data2 },
  ],
  1000
);
```

### `get(key: number): any | void`

Retrieves the value of an item from the cache. Returns `undefined` if the item does not exist or is expired.

```javascript
const data = cache.get(id);
```

### `mget(keys: Array<number>): Array<any | void>`

Retrieves the values of multiple items from the cache at once.

```javascript
const datas = cache.mget([id1, id2]);
```

### `del(key: number)`

Deletes an item from the cache.

```javascript
cache.del(id);
```

### `mdel(keys: Array<number>)`

Deletes multiple items from the cache at once.

```javascript
cache.mdel([id1, id2]);
```

### `clear()`

Clears all items from the cache.

```javascript
cache.clear();
```

### `peek(key: number): any | void`

Peeks at the value of an item without updating its frequency.

```javascript
const data = cache.peek(id);
```

#

## Eviction Policy

SyLFUCache implements a Least Frequently Used (LFU) eviction policy, which automatically removes the least frequently used items from the cache when the cache size limit is reached. It also supports manual eviction of a specified number of least frequently used items.

Additionally, SyLFUCache has a built-in mechanism for automatic eviction of expired items from the cache. A recurring process is started that evicts expired items from the cache at a certain interval.

Here is a detailed look at the eviction policy's public and private methods:

### `EvictionPolicy`

The constructor initializes the eviction policy with a cache and a logger, and starts the recurring process of evicting expired items from the cache.

```javascript
const evictionPolicy = new EvictionPolicy(cache, logger);
```

### `stopEvictingExpiredItems()`

This public method stops the recurring process that evicts expired items from the cache.

```javascript
evictionPolicy.stopEvictingExpiredItems();
```

### `startEvictingExpiredItems()`

This public method starts a recurring process that automatically evicts expired items from the cache at a certain interval.

```javascript
evictionPolicy.startEvictingExpiredItems();
```

### `autoEvictExpiredItems()`

This private method is called at the eviction interval and automatically evicts all expired items from the cache.

```javascript
// This method is called internally and is not accessible from outside.
```

### `updateEvictionInterval()`

This private method automatically updates the interval at which expired items are evicted from the cache based on the current cache size and the system load. The eviction interval is reduced if the cache size is close to its maximum size or if the system load is high.

```javascript
// This method is called internally and is not accessible from outside.
```

### `evictLFUItems(count)`

This public method manually evicts the specified number of least frequently used items from the cache. If the cache has fewer items than the specified count, it evicts all items.

```javascript
evictionPolicy.evictLFUItems(5);
```

All these methods together allow SyLFUCache to maintain an optimal cache size and provide efficient access to the most frequently used items, even under high system load.

Please note that the LFU eviction policy, automatic eviction of expired items, and automatic adjustment of the eviction interval are advanced features that may not be necessary for all applications. Use these features judiciously based on your application's requirements and the available system resources.

## License

[MIT](./LICENSE)
