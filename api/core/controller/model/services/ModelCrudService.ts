import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Model,
  ModelStatic,
  Transaction,
  UpdateOptions,
  WhereOptions,
} from 'sequelize';
import { MakeNullishOptional } from 'sequelize/types/utils';

// Unused, delete
export class ModelCrudService<T extends Model> {
  public async create(
    model: ModelStatic<T>,
    data: MakeNullishOptional<T['_creationAttributes']>,
    options?: CreateOptions,
    transaction?: Transaction
  ): Promise<T> {
    return (await model.create(data, { ...options, transaction: transaction })) as T;
  }

  public async update(
    data: Partial<T['_attributes']>,
    model: ModelStatic<T>,
    scopes?: string,
    options?: UpdateOptions,
    whereConditions: WhereOptions<T['_attributes']> = {},
    transaction?: Transaction
  ): Promise<[number, T[]]> {
    return await model.scope(scopes).update(data, {
      ...options,
      where: whereConditions,
      transaction: transaction,
      returning: true,
    });
  }

  public async delete(
    model: ModelStatic<T>,
    options?: DestroyOptions,
    scopes?: string,
    transaction?: Transaction,
    findOptions?: FindOptions
  ): Promise<number> {
    return await model.scope(scopes).destroy({
      ...options,
      transaction: transaction,
      ...findOptions,
    });
  }

  public async find(
    model: ModelStatic<T>,
    scopes?: string,
    transaction?: Transaction,
    findOptions?: FindOptions
  ): Promise<T[]> {
    return (await model.scope(scopes).findAll({
      ...findOptions,
      transaction: transaction,
    })) as T[];
  }

  public async findOne(
    model: ModelStatic<T>,
    scopes?: string[],
    transaction?: Transaction,
    findOptions?: FindOptions
  ): Promise<T | null> {
    return (await model.scope(scopes).findOne({
      ...findOptions,
      transaction: transaction,
    })) as T;
  }

  public async findById(
    id: number,
    model: ModelStatic<T>,
    scopes?: string[],
    transaction?: Transaction
  ): Promise<T | null> {
    return (await model.scope(scopes).findByPk(id, { transaction: transaction })) as T;
  }

  public async findAll(
    model: ModelStatic<T>,
    scopes?: string[],
    findOptions?: FindOptions
  ): Promise<T[]> {
    return await model.scope(scopes).findAll(findOptions);
  }
}
