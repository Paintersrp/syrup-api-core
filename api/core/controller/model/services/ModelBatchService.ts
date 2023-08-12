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

/**
 * A service class for performing batch operations (Create, Update, Delete) on a Sequelize model.
 *
 * @template T - The type of the model on which operations will be performed.
 */
export class ModelBatchService<T extends Model> {
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
   * Creates multiple new records in the database.
   *
   * @param records - An array of objects representing the records to be inserted.
   * @param options - Additional options for the creation.
   * @param transaction - An optional transaction to use for the creation.
   * @returns A promise that resolves to the newly created records.
   */
  public async batchCreate(
    records: MakeNullishOptional<T['_creationAttributes']>[],
    options?: CreateOptions,
    transaction?: Transaction
  ): Promise<T[]> {
    return (await this.model.bulkCreate(records, {
      ...options,
      transaction,
    })) as T[];
  }

  /**
   * Updates multiple records in the database that match the given conditions.
   *
   * @param data - The data to be updated.
   * @param conditions - The conditions to identify the records to be updated.
   * @param options - Additional options for the update.
   * @param transaction - An optional transaction to use for the update.
   * @returns A promise that resolves to the number of records updated.
   */
  public async batchUpdate(
    data: Partial<T['_attributes']>,
    conditions: WhereOptions,
    options?: UpdateOptions,
    transaction?: Transaction
  ): Promise<[affectedCount: number]> {
    return await this.model.update(data, { where: conditions, ...options, transaction });
  }

  /**
   * Deletes multiple records from the database that match the given conditions.
   *
   * @param conditions - The conditions to identify the records to be deleted.
   * @param options - Additional options for the deletion.
   * @param transaction - An optional transaction to use for the deletion.
   * @returns A promise that resolves to the number of records deleted.
   */
  public async batchDelete(
    conditions: WhereOptions,
    options?: DestroyOptions,
    transaction?: Transaction
  ): Promise<number> {
    return await this.model.destroy({ where: conditions, ...options, transaction });
  }
}
