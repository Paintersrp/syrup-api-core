import {
  Model,
  FindOptions,
  CreateOptions,
  UpdateOptions,
  DestroyOptions,
  Transaction,
  WhereOptions,
  ModelStatic,
} from 'sequelize';
import { MakeNullishOptional } from 'sequelize/types/utils';

import {
  ModelBatchService,
  ModelCRUDService,
  ModelOperationService,
  ModelQueryBuilder,
} from './services';

/**
 * Controller class responsible for handling CRUD operations and other
 * database operations for a given Sequelize model.
 *
 * This class provides a unified interface to interact with various CRUD and batch
 * operations, query building, and transactions.
 *
 * @template T - The type of the model being managed.
 *
 * ### Example
 * ```typescript
 * const userController = ModelController.of(User);
 *
 * // Creating a user
 * const newUser = await userController.create({ name: 'Alice' });
 *
 * // Finding a user by conditions
 * const foundUsers = await userController.where({ name: 'Alice' }).find();
 *
 * // Updating users by conditions
 * await userController.where({ name: 'Alice' }).update({ name: 'Bob' });
 * ```
 *
 * @see {@link ModelCRUDService} for CRUD operations.
 * @see {@link ModelOperationService} for additional operations.
 * @see {@link ModelBatchService} for batch operations.
 * @see {@link ModelQueryBuilder} for query building.
 */
export class ModelController<T extends Model> {
  private model: ModelStatic<T>;
  private modelTransaction?: Transaction;

  private queryBuilder: ModelQueryBuilder<T>;
  private crudService: ModelCRUDService<T>;
  private operationService: ModelOperationService<T>;
  private batchService: ModelBatchService<T>;

  /**
   * Creates a new `ModelController` instance for the given model.
   * @param model - The Sequelize model.
   */
  constructor(model: ModelStatic<T>) {
    this.model = model;

    this.queryBuilder = new ModelQueryBuilder();
    this.crudService = new ModelCRUDService(this.model);
    this.operationService = new ModelOperationService(this.model);
    this.batchService = new ModelBatchService(this.model);
  }

  /**
   * Factory method to create a `ModelController` instance.
   * @param model - The Sequelize model.
   * @returns A new `ModelController` instance.
   */
  public static of<T extends Model>(model: ModelStatic<T>) {
    return new ModelController<T>(model);
  }

  /**
   * Adds WHERE conditions to the query.
   * @param conditions - The WHERE conditions.
   * @returns The `ModelController` instance for further chaining.
   * @see {@link ModelQueryBuilder#where}
   */
  public where(conditions: WhereOptions<T['_attributes']>): this {
    this.queryBuilder.where(conditions);
    return this;
  }

  /**
   * Adds an include clause to the query.
   * @param include - The include clause.
   * @returns The `ModelController` instance for further chaining.
   * @see {@link ModelQueryBuilder#include}
   */
  public include(include: FindOptions['include']): this {
    this.queryBuilder.include(include);
    return this;
  }

  /**
   * Adds a scope to the query.
   * @param scopes - The scopes to be added.
   * @returns The `ModelController` instance for further chaining.
   * @see {@link ModelQueryBuilder#scope}
   */
  public scope(...scopes: string[]): this {
    this.queryBuilder.scope(...scopes);
    return this;
  }

  /**
   * Sets the order of the query.
   * @param order - The order criteria.
   * @returns The `ModelController` instance for further chaining.
   * @see {@link ModelQueryBuilder#orderBy}
   */
  public orderBy(order: FindOptions['order']): this {
    this.queryBuilder.orderBy(order);
    return this;
  }

  /**
   * Sets the limit of the query.
   * @param limit - The limit value.
   * @returns The `ModelController` instance for further chaining.
   * @see {@link ModelQueryBuilder#limit}
   */
  public limit(limit: number): this {
    this.queryBuilder.limit(limit);
    return this;
  }

  /**
   * Sets the offset of the query.
   * @param offset - The offset value.
   * @returns The `ModelController` instance for further chaining.
   * @see {@link ModelQueryBuilder#offset}
   */
  public offset(offset: number): this {
    this.queryBuilder.offset(offset);
    return this;
  }

  /**
   * Sets pagination parameters for the query.
   * @param page - The page number (starting from 1).
   * @param pageSize - The number of records per page.
   * @returns The `ModelController` instance for further chaining.
   * @see {@link ModelQueryBuilder#paginate}
   */
  public paginate(page: number, pageSize: number): this {
    this.queryBuilder.paginate(page, pageSize);
    return this;
  }

  /**
   * Creates a new record in the database.
   * @param data - The data to be inserted.
   * @param options - Additional options for the creation.
   * @returns A promise that resolves to the newly created record.
   * @see {@link ModelCRUDService#create}
   */
  public async create(
    data: MakeNullishOptional<T['_creationAttributes']>,
    options?: CreateOptions
  ): Promise<T> {
    return (await this.crudService.create(data, {
      ...options,
      transaction: this.modelTransaction,
    })) as T;
  }

  /**
   * Updates existing records in the database.
   * @param data - The data to be updated.
   * @param options - Additional options for the update.
   * @returns A promise that resolves to an array containing the number of affected rows and the affected rows themselves.
   * @see {@link ModelCRUDService#update}
   */
  public async update(
    data: Partial<T['_attributes']>,
    options?: UpdateOptions
  ): Promise<[number, T[]]> {
    return await this.crudService.update(data, this.queryBuilder, options, this.modelTransaction);
  }

  /**
   * Deletes records from the database.
   * @param options - Additional options for the deletion.
   * @returns A promise that resolves to the number of affected rows.
   * @see {@link ModelCRUDService#delete}
   */
  public async delete(options?: DestroyOptions): Promise<number> {
    return await this.crudService.delete(this.queryBuilder, options, this.modelTransaction);
  }

  /**
   * Finds multiple records in the database.
   * @returns A promise that resolves to the found records.
   * @see {@link ModelCRUDService#find}
   */
  public async find(): Promise<T[]> {
    return (await this.crudService.find(this.queryBuilder, this.modelTransaction)) as T[];
  }

  /**
   * Finds a single record in the database.
   * @returns A promise that resolves to the found record or null if not found.
   * @see {@link ModelCRUDService#findOne}
   */
  public async findOne(): Promise<T | null> {
    return (await this.crudService.findOne(this.queryBuilder, this.modelTransaction)) as T;
  }

  /**
   * Finds a record by its primary key.
   * @param id - The primary key value.
   * @returns A promise that resolves to the found record or null if not found.
   * @see {@link ModelCRUDService#findById}
   */
  public async findById(id: number): Promise<T | null> {
    return (await this.crudService.findById(id, this.modelTransaction)) as T;
  }

  /**
   * Executes a batch creation operation.
   * @param records - The records to be created.
   * @param options - Additional options for the creation.
   * @returns A promise that resolves to the created records.
   * @see {@link ModelBatchService#batchCreate}
   */
  public async batchCreate(
    records: MakeNullishOptional<T['_creationAttributes']>[],
    options?: CreateOptions
  ): Promise<T[]> {
    return (await this.batchService.batchCreate(records, options, this.modelTransaction)) as T[];
  }

  /**
   * Executes a batch update operation.
   * @param data - The data to be updated.
   * @param conditions - The conditions to match.
   * @param options - Additional options for the update.
   * @returns A promise that resolves to an array containing the number of affected rows.
   * @see {@link ModelBatchService#batchUpdate}
   */
  public async batchUpdate(
    data: Partial<T['_attributes']>,
    conditions: WhereOptions,
    options?: UpdateOptions
  ): Promise<[affectedCount: number]> {
    return await this.batchService.batchUpdate(data, conditions, options, this.modelTransaction);
  }

  public async batchDelete(conditions: WhereOptions, options?: DestroyOptions): Promise<number> {
    return await this.batchService.batchDelete(conditions, options, this.modelTransaction);
  }

  /**
   * Counts the number of records that match the query.
   * @returns A promise that resolves to the count.
   * @see {@link ModelOperationService#count}
   */
  public async count(): Promise<number> {
    return await this.operationService.count(this.queryBuilder, this.modelTransaction);
  }

  /**
   * Executes a transaction block.
   * @param callback - A callback function that receives the controller with the transaction set.
   * @returns A promise that resolves once the transaction is complete.
   * @see {@link ModelOperationService#transaction}
   */
  public async transaction(
    callback: (controller: ModelController<T>) => Promise<void>
  ): Promise<void> {
    await this.operationService.transaction(async (transaction) => {
      this.modelTransaction = transaction;
      await callback(this);
      this.modelTransaction = undefined;
    });
  }

  /**
   * Executes a custom query.
   * @param query - The custom query string.
   * @param replacements - The replacements for the query.
   * @returns A promise that resolves to the result of the query.
   * @see {@link ModelOperationService#customQuery}
   */
  public async customQuery(query: string, replacements?: any): Promise<any> {
    return await this.operationService.customQuery(query, replacements, this.modelTransaction);
  }

  /**
   * Checks if any records exist that match the given conditions.
   * @param conditions - The conditions to check for.
   * @returns A promise that resolves to true if any matching records are found, otherwise false.
   * @see {@link ModelOperationService#exists}
   */
  public async exists(conditions: WhereOptions): Promise<boolean> {
    return await this.operationService.exists(this.queryBuilder, conditions);
  }

  /**
   * Increments the specified fields of matching records.
   * @param fields - The fields to increment.
   * @param amount - The amount by which to increment the fields.
   * @returns A promise that resolves once the increment operation is complete.
   * @see {@link ModelOperationService#increment}
   */
  public async increment(fields: string | string[], amount: number = 1): Promise<void> {
    await this.operationService.increment(this.queryBuilder, fields, amount);
  }

  /**
   * Decrements the specified fields of matching records.
   * @param fields - The fields to decrement.
   * @param amount - The amount by which to decrement the fields.
   * @returns A promise that resolves once the decrement operation is complete.
   * @see {@link ModelOperationService#decrement}
   */
  public async decrement(fields: string | string[], amount: number = 1): Promise<void> {
    await this.operationService.decrement(this.queryBuilder, fields, amount);
  }
}
