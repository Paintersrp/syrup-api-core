# TODO LIST

## SyCache<T> Class:

- [ ] Implement caching policies other than LRU (like LFU, MRU)
- [ ] Add ability to optionally log all cache operations not just misses, evictions, and errors
- [ ] Add option for a configurable memory limit instead of just a max item count limit
- [ ] Implement "peek" function to inspect cache item without affecting its status in LRU
- [ ] Implement bulk operations like mget, mset and mdel for batch operations
- [ ] Include cache size limit on set() operation error handling
- [ ] Implement a system to prevent cache stampede situations
- [ ] Add support for custom serializer and deserializer functions for storing complex data types
- [ ] Add an optional feature to compress items in cache to save space
- [ ] Provide an option for persistent storage of cache data (e.g. to disk, Redis, etc.)

## Cache Interface and Options:

- [ ] Create an interface that will allow the user to define custom evict policies
- [ ] Allow per-item TTL instead of a global TTL setting

## Auto-evicting Mechanism:

- [ ] Optimize the auto-evicting mechanism, currently, it traverses the entire cache
- [ ] Add additional logic to make the eviction more intelligent (e.g., evicting based on hit counts)
- [ ] Create mechanism to dynamically adjust eviction interval based on cache size

## Test Coverage:

- [ ] Add test cases for each public method in SyCache class
- [ ] Add test cases for invalid inputs and error handling
- [ ] Test cache behavior under high load
- [ ] Test behavior during system shutdown
- [ ] Mock dependencies like database and logger for unit testing
- [ ] Test the `SyCache` class to ensure that the operations are correctly performed.
- [ ] Verify that the cache eviction policies are correctly implemented and work as expected.
- [ ] Test the database transaction functions to ensure data integrity.
- [ ] Test the `loadCacheFromDatabase` and `saveCacheToDatabase` methods to confirm proper loading and saving of cache data.
- [ ] Validate that the `autoEvictExpiredItems`, `evictLRUItem`, and `refreshItemExpiration` methods behave as expected.
- [ ] Review the `registerShutdownHandler` function and ensure it works correctly during various shutdown scenarios.
- [ ] Test the `start`, `set`, `get`, `del`, `clear`, `close`, `clearDatabase`, `getCacheSize`, and `getCacheStats` methods for expected behaviors.
- [ ] Confirm that the `monitorCachePerformance` method provides accurate and valuable statistics.
- [ ] Check edge cases and failure scenarios to ensure the system can handle them gracefully.
- [ ] Implement additional logging if necessary, and ensure that existing logging provides clear and useful information.
- [ ] Validate that the `CacheInterface` and `SyCacheOptions` interfaces are robust and flexible for various data types and options.
- [ ] Check and ensure that the cache system doesn't consume more memory than it should (it should respect the maxCacheSize limit).
- [ ] Consider adding more metrics for monitoring the performance of the cache system.
- [ ] Explore possibilities for cache partitioning if working with highly large data sets.

## Documentation and Code Quality:

- [ ] Improve inline comments for all methods
- [ ] Add JSDoc style comments for all classes, methods, and interfaces
- [ ] Refactor code for better readability
- [ ] Create a README.md with usage examples and API documentation

## Metrics Mixin

- [ ] Implement metrics mixin to track performance metrics of the cache system

## Heap Node / Min Heap Mixins

- [ ] Implement heap node and min heap mixins for efficient priority-based operations

## LFU Eviction Mixin

- [ ] Implement LFU eviction mixin for LFU cache eviction policy

## Persistence Mixin

- [ ] Implement persistence mixin for storing cache data to a persistent storage like disk or Redis
