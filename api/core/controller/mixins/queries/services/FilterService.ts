import { FindOptions, Model, ModelStatic, Op } from 'sequelize';
import { SyValidator } from '../../../../validators';
import { CustomWhere, FilterOptions, OperatorMapping, QueryType } from '../types';

/**
 * Service class for filtering database queries.
 */
export class FilterService {
  private modelAttributes: Set<string>;
  private validator: SyValidator;

  /**
   * Mapping of filter operators to Sequelize operator symbols.
   * These are used to construct the query condition in a Sequelize-compatible format.
   */
  private sequelizeOperators: { [operator: string]: symbol } = {
    greaterThan: Op.gt,
    lessThan: Op.lt,
    in: Op.in,
    notIn: Op.notIn,
    like: Op.like,
    notEqual: Op.ne,
    between: Op.between,
  };

  /**
   * Mapping of filter operators to functions that transform a string value into the desired format for a query condition.
   */
  private operators: OperatorMapping = {
    greaterThan: (value: string) => value,
    lessThan: (value: string) => value,
    in: (value: string) => value.split(','),
    notIn: (value: string) => value.split(','),
    like: (value: string) => `%${value}%`,
    notEqual: (value: string) => value,
    between: (value: string) => value.split(',') as [string, string],
  };

  constructor(model: ModelStatic<Model>, validator: SyValidator) {
    this.modelAttributes = new Set(Object.keys(model.getAttributes()));
    this.validator = validator;
  }

  /**
   * Add range filters to the FindOptions
   * @param {FindOptions} findOptions - Sequelize find options
   * @param {QueryType} query - The query parameters
   */
  public addRangeFilters(findOptions: FindOptions, query: QueryType): void {
    if (query.range && Array.isArray(query.range) && query.rangeColumn) {
      const [rangeStart, rangeEnd] = query.range;
      (findOptions.where as any)[query.rangeColumn] = {
        [Op.gte]: rangeStart,
        [Op.lte]: rangeEnd,
      };
    }
  }

  /**
   * Add filtering options to the FindOptions
   * @param {FindOptions} findOptions - Sequelize find options
   * @param {string} pathContext - The URL path context
   * @param {QueryType} query - The query parameters
   */
  public addFiltering(findOptions: FindOptions, pathContext: string, query: QueryType): void {
    if (query.filter && query.column && this.isValidFilterColumn(query.column, pathContext)) {
      if (!findOptions.where) {
        findOptions.where = {};
      }

      (findOptions.where as any)[query.column] = query.filter;
    }

    this.addQueryCondition(findOptions.where as any, query);
  }

  /**
   * Add query conditions to the CustomWhere object
   * @param {CustomWhere} where - The where clause
   * @param {FilterOptions} query - The query parameters
   */
  public addQueryCondition(where: CustomWhere, query: FilterOptions): void {
    for (const operatorKey in this.operators) {
      const queryValue = query[operatorKey as keyof FilterOptions];
      if (queryValue && typeof queryValue === 'string') {
        const sequelizeOperator = this.sequelizeOperators[operatorKey].toString();
        where[sequelizeOperator] = this.operators[operatorKey as keyof OperatorMapping](queryValue);
      }
    }
  }

  /**
   * Adds complex filtering conditions to the provided FindOptions.
   * @param {FindOptions} findOptions - Sequelize find options.
   * @param {QueryType} query - The query parameters containing complexFilter attribute.
   */
  public addComplexFiltering(findOptions: FindOptions, query: QueryType): void {
    if (query.complexFilter) {
      const filterConditions = JSON.parse(query.complexFilter);
      findOptions.where = this.processCondition(filterConditions);
    }
  }

  /**
   * Processes the complex condition to convert it into a Sequelize-compatible format.
   * @param condition - The complex condition to be processed.
   * @returns Returns a Sequelize-compatible condition object.
   */
  public processCondition(condition: any): any {
    let sequelizeCondition: any = {};

    if (condition.and) {
      sequelizeCondition[Op.and] = Object.entries(condition.and).map(([key, value]) => {
        if (typeof value === 'object' && !Array.isArray(value)) {
          return { [key]: this.processCondition(value) };
        } else {
          return { [key]: value };
        }
      });
    } else {
      for (const operator in condition) {
        if (this.sequelizeOperators[operator]) {
          sequelizeCondition[this.sequelizeOperators[operator]] = condition[operator];
        } else {
          sequelizeCondition[operator] = condition[operator];
        }
      }
    }

    return sequelizeCondition;
  }

  /**
   * Check if filter column is valid
   * @param {string} column - The column to check
   * @param {string} pathContext - The URL path context
   * @returns {boolean} True if valid, false otherwise
   */
  private isValidFilterColumn(column: string, pathContext: string): boolean {
    return (
      this.validator.assertAlphanumeric({
        param: column,
        context: pathContext,
      }) && this.modelHasColumn(column)
    );
  }

  /**
   * Check if the model has the specified column
   * @param {string} column - The column to check
   * @returns {boolean} True if the model has the column, false otherwise
   */
  private modelHasColumn(column: string): boolean {
    return this.modelAttributes.has(column);
  }
}
