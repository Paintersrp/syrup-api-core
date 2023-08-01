# TODO LIST

## SyLFUCache<T> Class:

- [x] Implement a dynamic memory limit which can adjust based on system memory availability.
- [x] Design and implement a "peek" function to inspect cache item without affecting its frequency count.
- [x] Establish a fail-safe mechanism during set() operation when cache size limit is reached.
- [x] Develop a strategy to prevent cache stampede situations, possibly using a probabilistic approach.

#

## Cache Interface and Options:

#

## Auto-evicting Mechanism:

- [x] Implement adaptive eviction interval mechanism based on cache size and system load.

#

## Documentation and Code Quality:

- [x] Enhance inline comments for all methods, providing more context and clarity.
- [x] Adopt a standardized format for jsdoc comments for all classes, methods, and interfaces.
- [x] Carry out code refactoring for better readability, maintainability, and performance.

#

## Test Coverage:

- [ ] Add comprehensive test cases covering all edge cases for public and private methods in SyLFUCache class.
- [ ] Include scenarios involving invalid inputs, concurrency issues and error handling in tests.
- [ ] Conduct stress testing and load testing to evaluate cache performance under high load.
- [ ] Test cache behavior during system shutdown and ensure cache state recovery upon restart.
- [ ] Mock dependencies like Sequelize database and Pino logger for more isolated unit testing.
- [ ] Set up a continuous integration (CI) environment for automated testing.

#

## Deployment

- [->] Create a comprehensive README.md with usage examples, API documentation, and contribution guidelines.

- [->] Develop a cache warming strategy for pre-populating the cache based on usage patterns.
- [->] Implement support for distributed caching for scalability in microservice architectures.
- [->] Create a user-friendly dashboard for real-time monitoring of cache status and metrics.

- [->] Develop a flexible interface for users to define custom eviction and replacement policies.
- [->] Support per-item TTL instead of a global TTL setting.

- [->] Enhance efficiency of auto-evicting mechanism, possibly using priority queues or similar data structures.
- [->] Develop a machine learning based eviction strategy, utilizing both frequency and recency of accesses.

- [MAYBE] Add support for custom serializer and deserializer functions for complex data types.
- [MAYBE] Implement optional compression feature for items in cache to save space using algorithms like Gzip, Brotli, etc.
