import Router from 'koa-router';
import { HttpStatus } from '../../../lib';
import { ControllerMixinOptions } from '../../types';
import { SyMixin } from '../SyMixin';

/**
 * Class providing list-related functionality.
 * @extends SyMixin
 */
export class SyReadMixin extends SyMixin {
  /**
   * Constructs a new instance of the SyListMixin class.
   * @param {MixinOptions} options - Options for initiating the Mixin class.
   */
  constructor(options: ControllerMixinOptions) {
    super(options);
  }

  /**
   * Retrieves all instances of the model with pagination, sorting, and filtering support.
   */
  public async all(ctx: Router.RouterContext) {
    const findOptions = await this.processQueryParams(ctx);
    const { count, rows } = await this.model.findAndCountAll(findOptions);

    this.createResponse(ctx, HttpStatus.OK, {
      count,
      data: rows,
    });
  }

  /**
   * Retrieves a specific instance of the model by its ID.
   */
  public async read(ctx: Router.RouterContext) {
    const id = this.processIdParam(ctx);
    const item = await this.findItemById(id);

    this.createResponse(ctx, HttpStatus.OK, item);
  }
}
