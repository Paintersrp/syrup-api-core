import { CustomWhere, QueryType } from '../types';

import * as settings from '../../../../../settings';
import { FindOptions, Op } from 'sequelize';

/**
 * Service class for managing pagination in database queries.
 */
export class PaginationService {
  private DEFAULT_PAGE_SIZE: number;
  private MAX_PAGE_SIZE: number;

  /**
   * Constructs a new instance of the PaginationService class.
   *
   * @param {number} [defaultPageSize] - The default number of items per page.
   * @param {number} [maxPageSize] - The maximum number of items allowed per page.
   */
  constructor(
    defaultPageSize: number = settings.CONTROLLERS.DEFAULT_PAGE_SIZE,
    maxPageSize: number = settings.CONTROLLERS.MAX_PAGE_SIZE
  ) {
    this.DEFAULT_PAGE_SIZE = defaultPageSize;
    this.MAX_PAGE_SIZE = maxPageSize;
  }

  /**
   * Calculate the offset for pagination
   * @param {QueryType} query - The query parameters
   * @returns {number} Calculated offset
   */
  public calculateOffset(query: QueryType): number {
    return ((query.page || 1) - 1) * (query.pageSize || this.DEFAULT_PAGE_SIZE);
  }

  /**
   * Calculate the limit for pagination
   * @param {number} [pageSize] - The page size
   * @returns {number} Calculated limit
   */
  public calculateLimit(pageSize?: number): number {
    return Math.min(pageSize || this.DEFAULT_PAGE_SIZE, this.MAX_PAGE_SIZE);
  }

  /**
   * Adds cursor-based pagination to the provided FindOptions.
   *
   * @param {FindOptions} findOptions - Sequelize find options to which the cursor conditions will be added.
   * @param {QueryType} query - The query parameters containing `before` or `after` attributes for cursor-based pagination.
   */
  public addCursorPagination(findOptions: FindOptions, query: QueryType): void {
    if (query.before) {
      (findOptions.where as CustomWhere).id = {
        [Op.lt]: query.before,
      };
    } else if (query.after) {
      (findOptions.where as CustomWhere).id = {
        [Op.gt]: query.after,
      };
    }
  }
}
