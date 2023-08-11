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

/**
 * Controller class for handling common database operations using Sequelize.
 * It allows you to easily create, read, update, and delete records, as well as execute custom queries and batch operations.
 *
 * @template T - The type of the Sequelize model.
 */
export class ModelController<T extends Model> {
  private model: ModelStatic<T>;
  private findOptions: FindOptions = {};
  private modelTransaction?: Transaction;
  private scopes: string[] = [];

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  /**
   * Add WHERE conditions to the query.
   * @param conditions - The conditions to be applied to the WHERE clause.
   * @returns The current instance of ModelController for chaining.
   */
  public where(conditions: WhereOptions<T['_attributes']>): this {
    this.findOptions.where = conditions;
    return this;
  }

  /**
   * Add JOIN conditions to the query.
   * @param include - The include conditions to be applied to the query.
   * @returns The current instance of ModelController for chaining.
   */
  public include(include: FindOptions['include']): this {
    this.findOptions.include = include;
    return this;
  }

  public scope(...scopes: string[]): this {
    this.scopes = scopes;
    return this;
  }

  public orderBy(order: FindOptions['order']): this {
    this.findOptions.order = order;
    return this;
  }

  public limit(limit: number): this {
    this.findOptions.limit = limit;
    return this;
  }

  public offset(offset: number): this {
    this.findOptions.offset = offset;
    return this;
  }

  /**
   * Create a new record in the database.
   * @param data - The data to be inserted.
   * @param options - Additional options for the creation.
   * @returns A promise that resolves to the newly created record.
   */
  public async create(
    data: MakeNullishOptional<T['_creationAttributes']>,
    options?: CreateOptions
  ): Promise<T> {
    return (await this.model.create(data, { ...options, transaction: this.modelTransaction })) as T;
  }

  /**
   * Update existing records in the database.
   * @param data - The data to be updated.
   * @param options - Additional options for the update.
   * @returns A promise that resolves to an array containing the number of affected rows and the affected rows themselves.
   */
  public async update(
    data: Partial<T['_attributes']>,
    options?: UpdateOptions
  ): Promise<[number, T[]]> {
    let whereConditions: WhereOptions<T['_attributes']> = {};
    if (this.findOptions.where) {
      whereConditions = { ...whereConditions, ...this.findOptions.where };
    }
    if (options?.where) {
      whereConditions = { ...whereConditions, ...options.where };
    }

    return await this.model.scope(...this.scopes).update(data, {
      ...options,
      where: whereConditions,
      transaction: this.modelTransaction,
      returning: true,
    });
  }

  public async delete(options?: DestroyOptions): Promise<number> {
    return await this.model.scope(...this.scopes).destroy({
      ...options,
      transaction: this.modelTransaction,
      ...this.findOptions,
    });
  }

  public async find(): Promise<T[]> {
    return (await this.model.scope(...this.scopes).findAll({
      ...this.findOptions,
      transaction: this.modelTransaction,
    })) as T[];
  }

  public async findOne(): Promise<T | null> {
    return (await this.model.scope(...this.scopes).findOne({
      ...this.findOptions,
      transaction: this.modelTransaction,
    })) as T;
  }

  public async findById(id: number): Promise<T | null> {
    return (await this.model
      .scope(...this.scopes)
      .findByPk(id, { transaction: this.modelTransaction })) as T;
  }

  public async findAll(): Promise<T[]> {
    return await this.model.scope(...this.scopes).findAll(this.findOptions);
  }

  public async count(): Promise<number> {
    return await this.model
      .scope(...this.scopes)
      .count({ ...this.findOptions, transaction: this.modelTransaction });
  }

  public async transaction(
    callback: (service: ModelController<T>) => Promise<void>
  ): Promise<void> {
    await this.model.sequelize!.transaction(async (t) => {
      this.modelTransaction = t;
      await callback(this);
      this.modelTransaction = undefined;
    });
  }

  /**
   * Executes a custom SQL query.
   * @param query - The SQL query to execute.
   * @param replacements - An object containing replacement values for placeholders in the query.
   * @returns A promise that resolves to the result of the query.
   */
  public async customQuery(query: string, replacements?: any): Promise<any> {
    return await this.model.sequelize!.query(query, {
      replacements,
      transaction: this.modelTransaction,
    });
  }

  /**
   * Executes a batch creation operation.
   * @param records - An array of objects representing the records to be created.
   * @param options - Additional options for the creation.
   * @returns A promise that resolves to an array of the newly created records.
   */
  public async batchCreate(
    records: MakeNullishOptional<T['_creationAttributes']>[],
    options?: CreateOptions
  ): Promise<T[]> {
    return (await this.model.bulkCreate(records, {
      ...options,
      transaction: this.modelTransaction,
    })) as T[];
  }

  public async batchUpdate(data: T, options?: UpdateOptions): Promise<[number, T[]]> {
    let whereConditions: WhereOptions<T['_attributes']> = {};
    if (this.findOptions.where) {
      whereConditions = { ...whereConditions, ...this.findOptions.where };
    }

    return await this.model.update(data, {
      where: whereConditions,
      ...options,
      ...this.findOptions,
      returning: true,
    });
  }

  public async batchDelete(options?: DestroyOptions): Promise<number> {
    return await this.model.destroy({ ...options, ...this.findOptions });
  }

  /**
   * Checks if any records exist that match the given conditions.
   * @param conditions - The conditions to check for.
   * @returns A promise that resolves to true if any matching records are found, otherwise false.
   */
  public async exists(conditions: WhereOptions): Promise<boolean> {
    const count = await this.model.scope(...this.scopes).count({ where: conditions });
    return count > 0;
  }

  /**
   * Increments the specified fields of matching records.
   * @param fields - The fields to increment.
   * @param amount - The amount by which to increment the fields.
   * @returns A promise that resolves once the increment operation is complete.
   */
  public async increment(fields: string | string[], amount: number = 1): Promise<void> {
    await this.model.scope(...this.scopes).increment(fields, { by: amount, ...this.findOptions });
  }

  /**
   * Decrements the specified fields of matching records.
   * @param fields - The fields to decrement.
   * @param amount - The amount by which to decrement the fields.
   * @returns A promise that resolves once the decrement operation is complete.
   */
  public async decrement(fields: string | string[], amount: number = 1): Promise<void> {
    await this.model.scope(...this.scopes).decrement(fields, { by: amount, ...this.findOptions });
  }
}
