# TODO LIST

## SyLFUCache<T> Class:

- [ ] Add support for different cache eviction strategies other than LFU (e.g. LRU, MRU).
- [ ] Develop a comprehensive logging strategy, including all cache operations and state changes.
- [ ] Implement a dynamic memory limit which can adjust based on system memory availability.
- [ ] Design and implement a "peek" function to inspect cache item without affecting its frequency count.
- [ ] Optimize bulk operations like mget, mset, and mdel by introducing batch operations.
- [ ] Establish a fail-safe mechanism during set() operation when cache size limit is reached.
- [ ] Develop a strategy to prevent cache stampede situations, possibly using a probabilistic approach.
- [ ] Add support for custom serializer and deserializer functions for complex data types.
- [ ] Implement optional compression feature for items in cache to save space using algorithms like Gzip, Brotli, etc.
- [ ] Develop a strategy for persistent storage of cache data, possibly with support for multiple backend options (e.g., disk, Redis, Memcached, etc.).

## Cache Interface and Options:

- [ ] Develop a flexible interface for users to define custom eviction and replacement policies.
- [ ] Support per-item TTL instead of a global TTL setting.
- [ ] Allow users to provide a custom hashing function for complex data types.
- [ ] Provide configuration options for logging verbosity levels.

## Auto-evicting Mechanism:

- [ ] Enhance efficiency of auto-evicting mechanism, possibly using priority queues or similar data structures.
- [ ] Develop a machine learning based eviction strategy, utilizing both frequency and recency of accesses.
- [ ] Implement adaptive eviction interval mechanism based on cache size and system load.

## Test Coverage:

- [ ] Add comprehensive test cases covering all edge cases for public and private methods in SyLFUCache class.
- [ ] Include scenarios involving invalid inputs, concurrency issues and error handling in tests.
- [ ] Conduct stress testing and load testing to evaluate cache performance under high load.
- [ ] Test cache behavior during system shutdown and ensure cache state recovery upon restart.
- [ ] Mock dependencies like Sequelize database and Pino logger for more isolated unit testing.
- [ ] Set up a continuous integration (CI) environment for automated testing.

## Documentation and Code Quality:

- [ ] Enhance inline comments for all methods, providing more context and clarity.
- [ ] Adopt a standardized format for jsdoc comments for all classes, methods, and interfaces.
- [ ] Carry out code refactoring for better readability, maintainability, and performance.
- [ ] Create a comprehensive README.md with usage examples, API documentation, and contribution guidelines.
- [ ] Set up a code linter and formatter for maintaining code quality.

## General:

- [ ] Implement support for distributed caching for scalability in microservice architectures.
- [ ] Develop a cache warming strategy for pre-populating the cache based on usage patterns.
- [ ] Create a user-friendly dashboard for real-time monitoring of cache status and metrics.
