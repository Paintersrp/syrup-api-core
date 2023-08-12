import {
  CreateOptions,
  DestroyOptions,
  Model,
  ModelStatic,
  Transaction,
  UpdateOptions,
  WhereOptions,
} from 'sequelize';
import { MakeNullishOptional } from 'sequelize/types/utils';
import { ModelQueryBuilder } from './ModelQueryBuilder';

/**
 * A service class for performing CRUD (Create, Read, Update, Delete) operations on a Sequelize model.
 *
 * @template T - The type of the model on which operations will be performed.
 */
export class ModelCRUDService<T extends Model> {
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
   * Creates a new record in the database.
   *
   * @param data - The data to be inserted.
   * @param options - Additional options for the creation.
   * @param transaction - An optional transaction to use for the creation.
   * @returns A promise that resolves to the newly created record.
   */
  public async create(
    data: MakeNullishOptional<T['_creationAttributes']>,
    options?: CreateOptions,
    transaction?: Transaction
  ): Promise<T> {
    return (await this.model.create(data, { ...options, transaction })) as T;
  }

  /**
   * Updates existing records in the database.
   *
   * @param data - The data to be updated.
   * @param queryBuilder - The query builder defining the query.
   * @param options - Additional options for the update.
   * @param transaction - An optional transaction to use for the update.
   * @returns A promise that resolves to an array containing the number of affected rows and the affected rows themselves.
   */
  public async update(
    data: Partial<T['_attributes']>,
    queryBuilder: ModelQueryBuilder<T>,
    options?: UpdateOptions,
    transaction?: Transaction
  ): Promise<[number, T[]]> {
    const { findOptions, scopes } = queryBuilder.returnOptions();

    let whereConditions: WhereOptions<T['_attributes']> = {};

    if (findOptions) {
      if (findOptions.where) {
        whereConditions = { ...whereConditions, ...findOptions.where };
      }
    }

    if (options?.where) {
      whereConditions = { ...whereConditions, ...options.where };
    }

    return await this.model.scope(...scopes).update(data, {
      ...options,
      where: whereConditions,
      transaction,
      returning: true,
    });
  }

  /**
   * Deletes records from the database that match the given query.
   *
   * @param queryBuilder - The query builder defining the query.
   * @param options - Additional options for the deletion.
   * @param transaction - An optional transaction to use for the deletion.
   * @returns A promise that resolves to the number of records deleted.
   */
  public async delete(
    queryBuilder: ModelQueryBuilder<T>,
    options?: DestroyOptions,
    transaction?: Transaction
  ): Promise<number> {
    const { findOptions, scopes } = queryBuilder.returnOptions();

    return await this.model.scope(...scopes).destroy({
      ...options,
      transaction,
      ...findOptions,
    });
  }

  /**
   * Finds records in the database that match the given query.
   *
   * @param queryBuilder - The query builder defining the query.
   * @param transaction - An optional transaction to use for the find operation.
   * @returns A promise that resolves to an array of matching records.
   */
  public async find(queryBuilder: ModelQueryBuilder<T>, transaction?: Transaction): Promise<T[]> {
    const { findOptions, scopes } = queryBuilder.returnOptions();

    return (await this.model.scope(...scopes).findAll({
      ...findOptions,
      transaction,
    })) as T[];
  }

  /**
   * Finds a single record in the database that matches the given query.
   *
   * @param queryBuilder - The query builder defining the query.
   * @param transaction - An optional transaction to use for the find operation.
   * @returns A promise that resolves to the matching record, or null if no matching record is found.
   */
  public async findOne(
    queryBuilder: ModelQueryBuilder<T>,
    transaction?: Transaction
  ): Promise<T | null> {
    const { findOptions, scopes } = queryBuilder.returnOptions();

    return (await this.model.scope(...scopes).findOne({
      ...findOptions,
      transaction,
    })) as T;
  }

  /**
   * Finds a record in the database by its primary key.
   *
   * @param id - The primary key value.
   * @param transaction - An optional transaction to use for the find operation.
   * @returns A promise that resolves to the matching record, or null if no matching record is found.
   */
  public async findById(id: number, transaction?: Transaction): Promise<T | null> {
    return (await this.model.findByPk(id, { transaction })) as T;
  }
}
