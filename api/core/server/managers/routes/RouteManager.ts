import Koa from 'koa';
import Router from 'koa-router';
import fs from 'fs';
import path from 'path';
import * as Yup from 'yup';
import { DataTypes, ModelStatic } from 'sequelize';

import { UserRoutes } from '../../../features/user';
import { ProfileRoutes } from '../../../features/profile';
import { BlacklistRoutes } from '../../../features/blacklist';
import { CacheRoutes } from '../../../features/cache';

import { paths } from '../../../../paths';
import { SyRoutes } from '../../../routes';
import { SyController } from '../../../controller';
import { LifecycleManager } from '../lifecycle/LifecycleManager';

import { RouteConstructor } from './types';
import { sequelizeToYupTypeMap } from './const';

/**
 * Class responsible for managing and initializing routes within a Koa application.
 */
export class RouteManager {
  /**
   * An array containing the internal routes of the application.
   */
  protected internalRoutes: RouteConstructor[] = [
    UserRoutes,
    ProfileRoutes,
    BlacklistRoutes,
    CacheRoutes,
  ];

  /**
   * Constructor for the RouteManager class.
   * Initializes and registers application and management routes.
   * @param {Koa} app - The Koa application instance.
   * @param {Router} router - The Koa router instance.
   * @param {LifecycleManager} lifecycleManager - The lifecycle manager instance.
   * @param {RouteConstructor[]} [routes] - Optional external routes to register.
   */
  constructor(
    app: Koa,
    router: Router,
    lifecycleManager: LifecycleManager,
    routes?: RouteConstructor[]
  ) {
    this.initializeRoutes(app, routes);
    this.initializeModelRoutes(app);
    this.initializeManagementRoutes(app, router, lifecycleManager);
  }

  /**
   * Registers application routes if provided, including internal and external routes.
   * @param {Koa} app - The Koa application instance.
   * @param {RouteConstructor[]} [routes] - Optional external routes to register.
   * @public
   */
  public initializeRoutes(app: Koa, routes?: RouteConstructor[]) {
    if (routes) {
      const appRoutes = [...this.internalRoutes, ...routes];

      appRoutes.forEach((RouteSet) => {
        new RouteSet(app);
      });
    } else {
      this.internalRoutes.forEach((RouteSet) => {
        new RouteSet(app);
      });
    }
  }

  /**
   * Initializes and registers CRUD/Query routes for Sequelize models automatically.
   * @param {Koa} app - The Koa application instance.
   */
  public async initializeModelRoutes(app: Koa) {
    const modelFiles = await this.findModelFiles(paths.api.models!);

    for (const modelFile of modelFiles) {
      const schemaFile = path.join(path.dirname(modelFile), 'schema.ts');

      if (fs.existsSync(schemaFile)) {
        this.setupModelAndSchema(app, modelFile, schemaFile);
      } else {
        this.setupModelAndGeneratedSchema(app, modelFile);
      }
    }
  }

  /**
   * Registers server management routes such as start and stop, and applies middleware for admin access.
   * @param {Koa} app - The Koa application instance.
   * @param {Router} router - The Koa router instance.
   * @param {LifecycleManager} lifecycleManager - The lifecycle manager instance.
   * @public
   */
  public initializeManagementRoutes(app: Koa, router: Router, lifecycleManager: LifecycleManager) {
    router.get(`/sys/start`, this.checkAdminRole(), lifecycleManager.start.bind(this));
    router.get(`/sys/stop`, this.checkAdminRole(), lifecycleManager.gracefulShutdown.bind(this));

    app.use(router.routes());
    app.use(router.allowedMethods());
  }

  /**
   * Middleware function for checking admin role.
   * Allows access to management routes for users with 'admin' or 'superadmin' roles.
   * @returns {Koa.Middleware} The middleware function.
   * @private
   */
  private checkAdminRole(): Koa.Middleware {
    return async function (ctx: Koa.Context, next: Koa.Next) {
      if (
        ctx.session &&
        ctx.session.user &&
        (ctx.session.user.role === 'admin' || ctx.session.user.role === 'superadmin')
      ) {
        await next();
      } else {
        ctx.status = 403;
        ctx.body = 'Forbidden: You do not have the necessary access rights.';
      }
    };
  }

  /**
   * Recursively finds model files in the specified directory.
   * @param {string} dir - The directory to search for model files.
   * @returns {Promise<string[]>} An array of model file paths.
   * @private
   */
  private async findModelFiles(dir: string): Promise<string[]> {
    const results: string[] = [];
    const list = await fs.promises.readdir(dir);

    for (const file of list) {
      const fullPath = path.join(dir, file);
      const stat = await fs.promises.stat(fullPath);

      if (stat.isDirectory()) {
        const subResults = await this.findModelFiles(fullPath);
        results.push(...subResults);
      } else if (file === 'model.ts') {
        results.push(fullPath);
      }
    }

    return results;
  }

  /**
   * Prepares and initializes a Sequelize model with a schema.
   * @param {Koa} app - The Koa application instance.
   * @param {string} modelFile - The path to the model file.
   * @param {string} schemaFile - The path to the schema file.
   */
  private async setupModelAndSchema(app: Koa, modelFile: string, schemaFile: string) {
    try {
      const [modelModule, schemaModule] = await Promise.all([
        import(modelFile),
        import(schemaFile),
      ]);

      const model = modelModule.default as ModelStatic<any>;
      const schema = schemaModule.default;

      this.initializeModel(app, model, schema, modelFile);
    } catch (error) {
      app.context.logger.error(`Error loading model or schema from ${modelFile}:`, error);
      throw error;
    }
  }
  /**
   * Prepares and initializes a Sequelize model with a generated schema.
   * @param {Koa} app - The Koa application instance.
   * @param {string} modelFile - The path to the model file.
   */
  private async setupModelAndGeneratedSchema(app: Koa, modelFile: string) {
    app.context.logger.warn(`Schema file not found for ${modelFile}. Generating a basic schema.`);

    try {
      const modelModule = await import(modelFile);
      const model = modelModule.default as ModelStatic<any>;
      const schema = this.generateSchemaFromModel(model);

      this.initializeModel(app, model, schema, modelFile);
    } catch (error) {
      app.context.logger.error(`Error loading model from ${modelFile}:`, error);
      throw error;
    }
  }

  /**
   * Initializes a Sequelize model with its associated schema and registers its routes.
   * @param {Koa} app - The Koa application instance.
   * @param {ModelStatic<any>} model - The Sequelize model to initialize.
   * @param {any} schema - The schema associated with the model.
   * @param {string} modelFile - The path to the model file.
   */
  private initializeModel(app: Koa, model: ModelStatic<any>, schema: any, modelFile: string) {
    if (!model) {
      app.context.logger.warn(`Model in ${modelFile} is null or undefined.`);
      return;
    }

    const isModelRegistered = Reflect.getMetadata('registered', model);

    if (!isModelRegistered) {
      app.context.logger.warn(`Model in ${modelFile} has not been registered.`);
      return;
    }

    const controller = new SyController({ model, schema, logger: app.context.logger });
    const route = new SyRoutes(controller, model.tableName, app, 'v1');

    if (!controller || !route) {
      app.context.logger.error('Controller or route could not be initialized.');
    }
  }

  /**
   * Generates a basic Yup schema from a Sequelize model.
   * @param {ModelStatic<any>} model - The Sequelize model.
   * @returns {Yup.Schema} A Yup schema.
   * @private
   */
  private generateSchemaFromModel(model: ModelStatic<any>): Yup.Schema {
    const schemaDefinition: { [key: string]: any } = {};

    for (const [attribute, type] of Object.entries(model.getAttributes())) {
      const sequelizeType = type.type as DataTypes.AbstractDataTypeConstructor | any;

      const dataType = sequelizeType.key;
      const allowNull = type.allowNull;

      const yupType = sequelizeToYupTypeMap[dataType] || Yup.mixed();
      let fieldSchema: Yup.Schema<any> = yupType.label(attribute);

      if (!allowNull) {
        fieldSchema = fieldSchema.required(`'${attribute}' is required`);
      }

      if (sequelizeType.options?.length) {
        fieldSchema = (fieldSchema as Yup.NumberSchema<number> | Yup.StringSchema<string>).max(
          sequelizeType.options.length,
          `'${attribute}' exceeds the maximum length/value of ${sequelizeType.options.length}`
        );
      }

      if (sequelizeType.values) {
        fieldSchema = fieldSchema.oneOf(sequelizeType.values);
      }

      schemaDefinition[attribute] = fieldSchema;
    }

    return Yup.object().shape(schemaDefinition);
  }
}
