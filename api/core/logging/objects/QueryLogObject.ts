import { FixedAbstractQuery, FixedQueryOptions } from '../../database/services/queries/types';

/**
 * Class representing a log object for each database query. It includes details about the query options, meta, and duration.
 */
export class QueryLogObject {
  constructor(
    public id: string,
    public type: string,
    public modelName: string,
    public sql: string,
    public duration: number,
    public sqlParameters: unknown,
    public queryOptions: FixedQueryOptions,
    public queryMeta: FixedAbstractQuery
  ) {}

  /**
   * Method to generate a log object for a given query.
   *
   * @param options - The options object for the query.
   * @param meta - The meta object for the query.
   * @param duration - The duration of the query in milliseconds.
   * @returns A new QueryLogObject instance representing the given query, options, and duration.
   */
  static generate(
    options: FixedQueryOptions,
    meta: FixedAbstractQuery,
    duration: number
  ): QueryLogObject {
    const id = meta.uuid as string;
    const modelName = meta.model?.name || 'Unknown';
    const sqlParameters = options.attributes;

    return new QueryLogObject(
      id,
      options.type || 'unknown',
      modelName,
      meta.sql,
      duration,
      sqlParameters,
      options,
      meta
    );
  }

  /**
   * Method to generate a log string from the QueryLogObject instance.
   *
   * @returns A string representing the query log.
   */
  public generateLogString(): string {
    return `Query ${this.type} on model ${this.modelName || 'Unknown'} took ${
      this.duration
    }ms [SQL: ${this.sql}]`;
  }
}
