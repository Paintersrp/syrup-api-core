import { FindOptions, Model, ModelStatic } from 'sequelize';
import { Context } from 'koa';

import { CustomWhere, QueryType } from './types';
import { SyValidator } from '../../../validators/SyValidator';

import {
  FilterService,
  PaginationService,
  ScopeService,
  SearchService,
  SortingService,
} from './services';

/**
 * Class responsible for processing Koa context query parameters to generate Sequelize FindOptions.
 * Utilizes specialized service classes to handle different types of query parameters.
 */
export class QueryProcessor {
  private model: ModelStatic<Model>;
  private validator: SyValidator;

  private filterService: FilterService;
  private paginationService: PaginationService;
  private scopeService: ScopeService;
  private searchService: SearchService;
  private sortingService: SortingService;

  /**
   * Constructs a new instance of the QueryProcessor class
   * @param {ModelStatic<Model>} model - The model to be used for query processing
   */
  constructor(model: ModelStatic<Model>, validator: SyValidator) {
    this.model = model;
    this.validator = validator;

    this.filterService = new FilterService(this.model, this.validator);
    this.paginationService = new PaginationService();
    this.scopeService = new ScopeService();
    this.searchService = new SearchService();
    this.sortingService = new SortingService(this.validator);
  }

  /**
   * Main method that processes query parameters and returns a FindOptions object
   * @param {Context} ctx - The Koa context
   * @returns {Promise<FindOptions>} Promise object representing the Sequelize find options
   */
  public async processQueryParams(ctx: Context): Promise<FindOptions> {
    const path = ctx.url;
    const query = ctx.request.query as QueryType;

    const findOptions: FindOptions = this.initialializeFindOptions(query);
    this.processPaginationParams(findOptions, query);
    this.processScopeParams(findOptions, query);
    this.processFilterParams(findOptions, query, path);
    this.processSearchParams(findOptions, query);
    this.processSortParams(findOptions, query, path);

    return findOptions;
  }

  /**
   * Create initial FindOptions with calculated offset and limit
   * @param {QueryType} query - The query parameters
   * @returns {FindOptions} Sequelize find options
   */
  private initialializeFindOptions(query: QueryType): FindOptions {
    return {
      offset: this.paginationService.calculateOffset(query),
      limit: this.paginationService.calculateLimit(query.pageSize),
      where: {} as CustomWhere,
    };
  }

  /**
   * Processes pagination related query parameters and updates the FindOptions object.
   *
   * @param {FindOptions} findOptions - Sequelize FindOptions object to be updated.
   * @param {QueryType} query - The query parameters from the context.
   */
  private processPaginationParams(findOptions: FindOptions, query: QueryType): void {
    this.paginationService.addCursorPagination(findOptions, query);
  }

  /**
   * Processes scope related query parameters (fields and includes) and updates the FindOptions object.
   *
   * @param {FindOptions} findOptions - Sequelize FindOptions object to be updated.
   * @param {QueryType} query - The query parameters from the context.
   */
  private processScopeParams(findOptions: FindOptions, query: QueryType): void {
    this.scopeService.addFields(findOptions, query.fields);
    this.scopeService.addIncludes(findOptions, query.includes);
  }

  /**
   * Processes filter related query parameters and updates the FindOptions object.
   *
   * @param {FindOptions} findOptions - Sequelize FindOptions object to be updated.
   * @param {QueryType} query - The query parameters from the context.
   * @param {string} path - The URL path context.
   */
  private processFilterParams(findOptions: FindOptions, query: QueryType, path: string): void {
    this.filterService.addFiltering(findOptions, path, query);
    this.filterService.addRangeFilters(findOptions, query);
    this.filterService.addComplexFiltering(findOptions, query);
  }

  /**
   * Processes search related query parameters and updates the FindOptions object.
   *
   * @param {FindOptions} findOptions - Sequelize FindOptions object to be updated.
   * @param {QueryType} query - The query parameters from the context.
   */
  private processSearchParams(findOptions: FindOptions, query: QueryType): void {
    this.searchService.addSearch(findOptions, query);
  }

  /**
   * Processes sorting related query parameters and updates the FindOptions object.
   *
   * @param {FindOptions} findOptions - Sequelize FindOptions object to be updated.
   * @param {QueryType} query - The query parameters from the context.
   * @param {string} path - The URL path context.
   */
  private processSortParams(findOptions: FindOptions, query: QueryType, path: string): void {
    this.sortingService.addSorting(findOptions, path, query);
  }
}
