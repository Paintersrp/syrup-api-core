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
  searchColumns?: string[];
  range?: [string, string];
  rangeColumn?: string;
  includes?: string[];
}

/**
 * The interface for advanced filter options. Supports greater than, less than, in, not in, like, not equal, and between conditions.
 */
export interface AdvancedFilterOptions {
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
export interface ControllerQueryOptions extends QueryParams, AdvancedFilterOptions {}
