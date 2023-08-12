import { Model, ModelStatic, Transaction, WhereOptions } from 'sequelize';

import { ModelQueryBuilder } from './ModelQueryBuilder';

/**
 * A service class for performing common database operations on a Sequelize model.
 *
 * @template T - The type of the model on which operations will be performed.
 */
export class ModelOperationService<T extends Model> {
  private model: ModelStatic<T>;

  /**
   * Constructs a new instance of the service for the given model.
   *
   * @param model - The Sequelize model on which operations will be performed.
   */
  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  /**
   * Executes a callback within a transaction.
   *
   * @param callback - A callback that receives the transaction and performs operations within it.
   * @returns A promise that resolves when the transaction is complete.
   */
  public async transaction(callback: (transaction: Transaction) => Promise<void>): Promise<void> {
    await this.model.sequelize!.transaction(callback);
  }

  /**
   * Counts the number of records that match the given query.
   *
   * @param queryBuilder - The query builder defining the query.
   * @param transaction - An optional transaction to use for the query.
   * @returns A promise that resolves to the count of matching records.
   */
  public async count(
    queryBuilder: ModelQueryBuilder<T>,
    transaction?: Transaction
  ): Promise<number> {
    const { findOptions, scopes } = queryBuilder.returnOptions();
    return await this.model.scope(...scopes).count({ ...findOptions, transaction });
  }

  /**
   * Executes a custom SQL query.
   *
   * @param query - The SQL query to execute.
   * @param replacements - An optional object containing replacement values for placeholders in the query.
   * @param transaction - An optional transaction to use for the query.
   * @returns A promise that resolves to the results of the query.
   * @throws {Error} Throws an error if the query is not valid.
   */
  public async customQuery(
    query: string,
    replacements?: any,
    transaction?: Transaction
  ): Promise<any> {
    this.validateQuery(query);
    this.sanitizeReplacements(replacements);

    return await this.model.sequelize!.query(query, {
      replacements,
      transaction,
    });
  }

  /**
   * Checks if any records exist that match the given conditions.
   *
   * @param queryBuilder - The query builder defining the query.
   * @param conditions - The conditions to check for.
   * @returns A promise that resolves to true if any matching records are found, otherwise false.
   */
  public async exists(
    queryBuilder: ModelQueryBuilder<T>,
    conditions: WhereOptions
  ): Promise<boolean> {
    const { scopes } = queryBuilder.returnOptions();
    const count = await this.model.scope(...scopes).count({ where: conditions });
    return count > 0;
  }

  /**
   * Increments the specified fields of matching records by the given amount.
   *
   * @param queryBuilder - The query builder defining the query.
   * @param fields - The fields to increment, either as a string or an array of strings.
   * @param amount - The amount by which to increment the fields (default is 1).
   * @returns A promise that resolves once the increment operation is complete.
   */
  public async increment(
    queryBuilder: ModelQueryBuilder<T>,
    fields: string | string[],
    amount: number = 1
  ): Promise<void> {
    const { findOptions, scopes } = queryBuilder.returnOptions();
    await this.model.scope(...scopes).increment(fields, { by: amount, ...findOptions });
  }

  /**
   * Decrements the specified fields of matching records by the given amount.
   *
   * @param queryBuilder - The query builder defining the query.
   * @param fields - The fields to decrement, either as a string or an array of strings.
   * @param amount - The amount by which to decrement the fields (default is 1).
   * @returns A promise that resolves once the decrement operation is complete.
   */
  public async decrement(
    queryBuilder: ModelQueryBuilder<T>,
    fields: string | string[],
    amount: number = 1
  ): Promise<void> {
    const { findOptions, scopes } = queryBuilder.returnOptions();
    await this.model.scope(...scopes).decrement(fields, { by: amount, ...findOptions });
  }

  /**
   * Validates the given SQL query to ensure it meets certain criteria.
   *
   * @param query - The query to validate.
   * @throws {Error} Throws an error if the query does not meet the validation criteria.
   * @private
   */
  private validateQuery(query: string): void {
    const pattern = /^SELECT [\w\s,.*]+ FROM [\w\s,]+$/i;
    if (!pattern.test(query)) {
      throw new Error('Invalid query operation');
    }
  }

  /**
   * Sanitizes the given replacements object to remove or escape potentially harmful characters.
   *
   * @param replacements - The object containing replacement values for placeholders in a SQL query.
   * @returns The sanitized replacements object.
   * @private
   */
  private sanitizeReplacements(replacements: any): any {
    for (const key in replacements) {
      if (typeof replacements[key] === 'string') {
        replacements[key] = replacements[key].replace(/'/g, "''");
      }
    }
    return replacements;
  }
}
