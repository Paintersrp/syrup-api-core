import { FindOptions } from 'sequelize';

import { QueryType } from '../types';
import { BadRequestError } from '../../../../errors/client';
import { SyValidator } from '../../../../validators';
import * as settings from '../../../../../settings';

/**
 * Service class for managing the sorting order of results in database queries.
 */
export class SortingService {
  private validator: SyValidator;
  private validSortOptions: string[];

  /**
   * Constructs a new instance of the SortingService class.
   *
   * @param {SyValidator} validator - A validator instance used for various validations.
   * @param {string[]} [validSortOptions] - An array of valid sorting options.
   */
  constructor(
    validator: SyValidator,
    validSortOptions: string[] = settings.CONTROLLERS.VALID_SORT_OPTIONS
  ) {
    this.validator = validator;
    this.validSortOptions = validSortOptions;
  }

  /**
   * Add sorting options to the FindOptions
   * @param {FindOptions} findOptions - Sequelize find options
   * @param {string} pathContext - The URL path context
   * @param {QueryType} query - The query parameters
   */
  public addSorting(findOptions: FindOptions, pathContext: string, query: QueryType): void {
    if (query.sort && query.sortOrder) {
      const fields = query.sort.split(',');
      const orders = query.sortOrder.split(',');

      if (fields.length !== orders.length) {
        throw new BadRequestError('Number of sort fields and sort orders do not match');
      }

      findOptions.order = fields.map((field, index) => {
        if (!this.isValidSortOption(orders[index], pathContext)) {
          throw new BadRequestError(`Invalid sort order: ${orders[index]}`);
        }

        return [field, orders[index]];
      });
    }
  }

  /**
   * Determines if the provided sort option is valid.
   *
   * Validation is performed based on alphanumeric checks and whether the sort option exists in the list of valid sort options.
   *
   * @param {string} sort - The sort option to check.
   * @param {string} pathContext - The URL path context.
   * @returns {boolean} True if the sort option is valid, false otherwise.
   */
  private isValidSortOption(sort: string, pathContext: string): boolean {
    return (
      this.validator.assertAlphanumeric({ param: sort, context: pathContext }) &&
      this.validSortOptions.includes(sort.toLowerCase())
    );
  }
}
