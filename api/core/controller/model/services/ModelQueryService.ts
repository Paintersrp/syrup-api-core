import { FindOptions, Model, WhereOptions } from 'sequelize';

// Unused, delete
export class ModelQueryService {
  protected _findOptions: FindOptions = {};
  protected _scopes: string[] = [];

  public get scopes(): string[] {
    return this.scopes;
  }
  public set scopes(scopes: string[]) {
    this._scopes = scopes;
  }

  public get findOptions(): FindOptions {
    return this.findOptions;
  }
  public set findOptions(findOptions: FindOptions) {
    this.findOptions = findOptions;
  }

  public where(conditions: WhereOptions): this {
    this.findOptions.where = conditions;
    return this;
  }

  public include(include: FindOptions['include']): this {
    this.findOptions.include = include;
    return this;
  }

  public scope(...scopes: string[]): this {
    this._scopes = scopes;
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
}
