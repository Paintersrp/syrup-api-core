import { WhereAttributeHash, Op } from 'sequelize';

/**
 * The interface for query parameters. Supports basic pagination, field selection, sorting, filtering, and searching.
 */
export interface QueryParams {
  page?: number;
  pageSize?: number;
  fields?: string;
  sort?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: string;
  column?: string;
  search?: string;
  searchColumns?: string;
  range?: [string, string];
  rangeColumn?: string;
  includes?: string;
  before?: number;
  after?: number;
  complexFilter?: string;
}

/**
 * The interface for advanced filter options. Supports greater than, less than, in, not in, like, not equal, and between conditions.
 */
export interface FilterOptions {
  [key: string]: number | string | string[] | undefined;
  greaterThan?: string;
  lessThan?: string;
  in?: string[];
  notIn?: string[];
  like?: string;
  notEqual?: string;
  between?: string;
}

/**
 * The interface for the controller query options. Extends both the QueryParams and AdvancedFilterOptions interfaces.
 */
export interface QueryOptions extends QueryParams, FilterOptions {}

export type QueryType = Partial<QueryOptions>;

export type OperatorFunc = (value: string) => any;
export type OperatorMapping = { [operator: string]: OperatorFunc };

export interface CustomWhere extends WhereAttributeHash {
  [Op.like]?: string;
  [Op.iLike]?: any;
  [Op.or]?: CustomWhere | CustomWhere[];
  [Op.and]?: CustomWhere | CustomWhere[];
  [Op.gte]?: number;
  [Op.lte]?: number;
  [Op.ne]?: string;
  [Op.in]?: string[];
  [Op.notIn]?: string[];
  [Op.between]?: [string, string];
  // add other Op keys as necessary
}
