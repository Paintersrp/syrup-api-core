import { AbstractQuery } from 'sequelize/types/dialects/abstract/query';

export interface QueryLogObject {
  id: string;
  type: string | undefined;
  modelName: string;
  sql: string;
  duration: number;
}

export type FixedAbstractQuery = AbstractQuery & { sql: string };
