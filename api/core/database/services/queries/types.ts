import { QueryOptions } from 'sequelize';
import { AbstractQuery } from 'sequelize/types/dialects/abstract/query';

export interface QueryLogObjectContext {
  id: string;
  type: string;
  modelName: string;
  sql: string;
  duration: number;
  sqlParameters: any;
  instance?: any;
}

export type FixedAbstractQuery = AbstractQuery & { sql: string };
export type FixedQueryOptions = QueryOptions & { attributes: string[] };
