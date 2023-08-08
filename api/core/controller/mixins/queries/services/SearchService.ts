import { FindOptions, Op } from 'sequelize';

import { CustomWhere, QueryType } from '../types';

/**
 * Service class for adding search functionality to database queries.
 */
export class SearchService {
  /**
   * Add search options to the FindOptions
   *
   * @param {FindOptions} findOptions - Sequelize find options
   * @param {QueryType} query - The query parameters
   */
  public addSearch(findOptions: FindOptions, query: QueryType): void {
    if (query.search && query.searchColumns) {
      const columnsToSearch = query.searchColumns.split(',');

      (findOptions.where as CustomWhere)[Op.or] = {
        [Op.or]: columnsToSearch.map((column: string) => ({
          [column]: {
            [Op.like]: `%${query.search}%`,
          },
        })),
      };
    }
  }
}
