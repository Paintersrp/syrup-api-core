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
- [ ] Implement sync and async hooks for lifecycle events (e.g., onSet, onGet, onEvict)
- [ ] Implement a feature to replicate cache over multiple instances (distributed caching)

## Cache Interface and Options:

- [ ] Create an interface that will allow the user to define custom evict policies
- [ ] Allow per-item TTL instead of a global TTL setting
- [ ] Support for namespaces or tags for grouping and operating on a subset of cache

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
- [ ] Include load testing and cache hit ratio measurement in benchmarks
- [ ] Simulate and test cache stampede scenarios

## Documentation and Code Quality:

- [ ] Improve inline comments for all methods
- [ ] Add jsdoc style comments for all classes, methods, and interfaces
- [ ] Refactor code for better readability
- [ ] Create a README.md with usage examples and API documentation
- [ ] Create a CONTRIBUTING.md file for other developers

## Versioning and Deployment:

- [ ] Setup semantic versioning for the package
- [ ] Implement continuous integration/continuous deployment (CI/CD) pipeline
- [ ] Automate generation of API docs from jsdoc comments

## Integration and Compatibility:

- [ ] Ensure compatibility with different Node.js versions
- [ ] Develop a browser-compatible version of the cache
- [ ] Develop extensions or plugins for integration with popular frameworks (like Express.js)
