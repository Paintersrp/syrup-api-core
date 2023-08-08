# Syrup's Enhanced QueryProcessor

The `QueryProcessor` class in the Syrup framework is optimized for clarity, modularity, and ease of use. Designed to process Koa's request context and produce Sequelize `FindOptions`, it employs specialized service classes for distinct aspects of query processing.

#### Features:

- **Modularity**: Split into specialized service classes to maintain code clarity.
- **Pagination**: Full pagination support, both standard and cursor-based.
- **Sorting**: Dynamic sorting to structure your result sets.
- **Filtering**: Apply different filter mechanisms.
- **Search**: Full-text search across multiple columns.
- **Scoping**: Flexible field inclusion/exclusion and model associations.

#### Setup:

1. Ensure Sequelize models are ready.
2. Import and instantiate the `QueryProcessor` in your Koa routes or controllers.

### API Documentation

#### Class: `QueryProcessor`

##### Constructor:

`constructor(model: ModelStatic<Model>, validator: SyValidator)`

- `model`: Sequelize model for the query processing.
- `validator`: Custom validator instance (e.g., `SyValidator`).

##### Method:

`async processQueryParams(ctx: Context): Promise<FindOptions>`

- `ctx`: Koa context containing request details.
- **Returns**: Promise that resolves to a `FindOptions` object.

---

**Private Methods**:

These methods leverage the specialized service classes to process specific query parameters:

1. **Initialization**:

   - `initialializeFindOptions(query: QueryType): FindOptions`: Set up the initial state of the FindOptions object with default values.

2. **Pagination**:

   - `processPaginationParams(findOptions: FindOptions, query: QueryType): void`: Manage standard and cursor-based pagination.

3. **Scope**:

   - `processScopeParams(findOptions: FindOptions, query: QueryType): void`: Handle field inclusion/exclusion and manage model associations.

4. **Filtering**:

   - `processFilterParams(findOptions: FindOptions, query: QueryType, path: string): void`: Use various mechanisms, including range and complex conditions, to filter results.

5. **Searching**:

   - `processSearchParams(findOptions: FindOptions, query: QueryType): void`: Implement full-text search across specified columns.

6. **Sorting**:
   - `processSortParams(findOptions: FindOptions, query: QueryType, path: string): void`: Sort results based on user input.

---

### Examples

#### Using the QueryProcessor:

```typescript
import { QueryProcessor } from 'path-to-query-processor';
import { MyModel } from 'path-to-my-model';

const processor = new QueryProcessor(MyModel, new SyValidator());

// Inside a Koa route or controller:
router.get('/my-endpoint', async (ctx) => {
  const options = await processor.processQueryParams(ctx);
  ctx.body = await MyModel.findAll(options);
});
```

#### Sample Queries:

1. **Pagination**:

   - Standard: `/my-endpoint?page=2&pageSize=10`
   - Cursor-based: `/my-endpoint?after=12345&pageSize=10`

2. **Sorting**:

   - Ascending: `/my-endpoint?sort=name&sortOrder=ASC`
   - Descending: `/my-endpoint?sort=age&sortOrder=DESC`

3. **Filtering**:

   - Basic: `/my-endpoint?filter=John&column=name`
   - Range: `/my-endpoint?rangeStart=1990-01-01&rangeEnd=2000-01-01&column=dateOfBirth`
   - Complex: `/my-endpoint?filterType=lessThan&value=30&column=age`

4. **Searching**:

   - Across Columns: `/my-endpoint?search=Smith&searchColumns=name,address`

5. **Scoping**:
   - Field Inclusion: `/my-endpoint?fields=name,age,address`
   - Model Association: `/my-endpoint?includes=Profile,Orders`

---
