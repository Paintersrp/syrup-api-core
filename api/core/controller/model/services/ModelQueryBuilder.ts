import { FindOptions, Model, WhereOptions } from 'sequelize';

/**
 * A fluent query builder class for constructing complex Sequelize queries.
 *
 * This class helps in building queries by chaining methods together in a readable manner.
 *
 * @template T - The type of the model being queried.
 */
export class ModelQueryBuilder<T extends Model> {
  private findOptions: FindOptions = {};
  private scopes: string[] = [];

  /**
   * Adds WHERE conditions to the query.
   * @param conditions - The WHERE conditions.
   * @returns The query builder instance for further chaining.
   */
  public where(conditions: WhereOptions<T['_attributes']>): this {
    this.findOptions.where = conditions;
    return this;
  }

  /**
   * Includes associated models in the query.
   * @param include - The associated models to include.
   * @returns The query builder instance for further chaining.
   */
  public include(include: FindOptions['include']): this {
    this.findOptions.include = include;
    return this;
  }

  /**
   * Applies named scopes to the query.
   * @param scopes - The named scopes to apply.
   * @returns The query builder instance for further chaining.
   */
  public scope(...scopes: string[]): this {
    this.scopes = scopes;
    return this;
  }

  /**
   * Orders the results of the query.
   * @param order - The ordering conditions.
   * @returns The query builder instance for further chaining.
   */
  public orderBy(order: FindOptions['order']): this {
    this.findOptions.order = order;
    return this;
  }

  /**
   * Limits the number of results returned by the query.
   * @param limit - The maximum number of results to return.
   * @returns The query builder instance for further chaining.
   */
  public limit(limit: number): this {
    this.findOptions.limit = limit;
    return this;
  }

  /**
   * Offsets the results of the query by a given number.
   * @param offset - The number of results to offset.
   * @returns The query builder instance for further chaining.
   */
  public offset(offset: number): this {
    this.findOptions.offset = offset;
    return this;
  }

  /**
   * Paginates the results of the query.
   * @param page - The page number to retrieve.
   * @param pageSize - The number of results per page.
   * @returns The query builder instance for further chaining.
   */
  public paginate(page: number, pageSize: number): this {
    this.findOptions.limit = pageSize;
    this.findOptions.offset = (page - 1) * pageSize;
    return this;
  }

  /**
   * Returns the constructed query options.
   * @returns The find options for the query.
   */
  public getQueryOptions(): FindOptions {
    return this.findOptions;
  }

  /**
   * Returns the scopes applied to the query.
   * @returns The named scopes for the query.
   */
  public getScopes(): string[] {
    return this.scopes;
  }

  /**
   * Returns the combined query options and scopes.
   * @returns An object containing the find options and scopes for the query.
   */
  public returnOptions(): {
    findOptions: FindOptions<any> | undefined;
    scopes: string[];
  } {
    const findOptions = this.getQueryOptions();
    const scopes = this.getScopes() || [];
    return { findOptions, scopes };
  }
}
