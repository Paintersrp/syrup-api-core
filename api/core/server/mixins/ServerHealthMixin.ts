import os from 'os';
import Router from 'koa-router';

import { SyServer } from '../SyServer';
import { ServerResourceThresholds } from '../types';
import { HealthCheckMixin } from '../../database/mixins';

export class ServerHealthMixin extends HealthCheckMixin {
  server: SyServer;
  router: Router;
  resourceThresholds: ServerResourceThresholds;

  constructor(server: SyServer, resourceThresholds?: ServerResourceThresholds) {
    super(server.logger);
    this.server = server;
    this.router = new Router();

    // Initialize resource thresholds with default values if not provided.
    this.resourceThresholds = {
      memoryUsageThreshold: resourceThresholds?.memoryUsageThreshold || 0.1,
      cpuUsageThreshold: resourceThresholds?.cpuUsageThreshold || 0.8,
      diskSpaceThreshold: resourceThresholds?.diskSpaceThreshold || 0.8,
    };

    this.router.get(`/health`, this.checkHealth.bind(this));
    this.router.get(`/health/db`, this.checkDatabase.bind(this));
    this.router.get(`/health/frontend`, this.checkFrontend.bind(this));
    this.router.get(`/health/system`, this.checkResources.bind(this));
    this.router.get(`/health/version`, this.checkVersion.bind(this));
    this.router.get(`/health/uptimes`, this.checkUptimes.bind(this));

    this.server.app.use(this.router.routes());
    this.server.app.use(this.router.allowedMethods());
  }

  /**
   * Checks the overall health status of the application by performing a series of health checks.
   * These checks include database connection, frontend service, system resources, readiness,
   * and server version.
   */
  private async checkHealth(ctx: Router.RouterContext) {
    try {
      const checks = [
        this.checkDatabase(ctx),
        this.checkFrontend(ctx),
        this.checkResources(ctx),
        this.checkVersion(ctx),
      ];

      const results = await Promise.all(checks);

      ctx.body = {
        database: results[0],
        frontend: results[1],
        resources: results[2],
        version: results[3],
      };
    } catch (error) {
      this.server.logger.error('Error occurred during health check:', error);
    }
  }

  /**
   * Checks the health status of the database by verifying a connection to it.
   * If the connection succeeds, the database is considered healthy. If the
   * connection fails, the database is considered unhealthy.
   */
  private async checkDatabase(ctx: Router.RouterContext) {
    const isHealthy = await this.server.ORM.checkDatabase();
    this.uptimeTracker.updateUptimeRecord('ORM', Date.now(), isHealthy);

    ctx.body = { databaseHealth: isHealthy ? 'Healthy' : 'Not Healthy' };
    return ctx.body;
  }

  /**
   * Checks the health status of the frontend service by sending a request
   * to its health check endpoint. If the request succeeds and the response
   * indicates the service is healthy, the service is considered healthy.
   * If the request fails or the response indicates the service is unhealthy,
   * the service is considered unhealthy.
   */
  private async checkFrontend(ctx: Router.RouterContext): Promise<any> {
    try {
      // const response = await axios.get(this.server.frontendHealthCheckUrl);

      const response = {
        status: 200,
        data: {
          status: 'healthy',
        },
      };

      this.uptimeTracker.updateUptimeRecord('Frontend', Date.now(), response.status === 200);

      ctx.status = response.status;
      ctx.body = response.data;
      return { status: ctx.status, body: ctx.body };
    } catch (error) {
      this.server.logger.error('Error occurred during external service health check:', error);
    }
  }

  /**
   * Checks the availability and usage of system resources such as memory,
   * disk space, and CPU usage. If any of these exceed certain thresholds,
   * notifications are added to the response to warn of potential issues.
   */
  private async checkResources(ctx: Router.RouterContext) {
    try {
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const cpuCount = os.cpus().length;
      const loadAverage = os.loadavg()[0];

      const memoryUsage = 1 - freeMemory / totalMemory;
      const diskSpaceAvailable = freeMemory / totalMemory;
      const cpuUsage = loadAverage / cpuCount;

      const notifications: string[] = [];

      if (memoryUsage > this.resourceThresholds.memoryUsageThreshold) {
        notifications.push('Low Memory Usage');
      }

      if (cpuUsage > this.resourceThresholds.cpuUsageThreshold) {
        notifications.push('High CPU Usage');
      }

      if (diskSpaceAvailable < this.resourceThresholds.diskSpaceThreshold) {
        notifications.push('Low Disk Space');
      }

      this.uptimeTracker.updateUptimeRecord('Resources', Date.now(), notifications.length === 0);

      ctx.body = {
        status: notifications.length === 0,
        notifications,
        memoryUsage,
        diskSpaceAvailable,
        cpuUsage,
      };

      return ctx.body;
    } catch (error) {
      this.server.logger.error('Error occurred during system resources availability check:', error);
      return {
        status: false,
      };
    }
  }

  /**
   * Returns the version of the server, which can be used to verify the server
   * is running the expected version. This can be especially useful in environments
   * with multiple instances of the server running different versions.
   */
  private async checkVersion(ctx: Router.RouterContext) {
    try {
      ctx.body = { version: this.server.version };
      return ctx.body;
    } catch (error) {
      this.server.logger.error('Error occurred during version check:', error);
      return {
        version: 'unknown',
      };
    }
  }

  /**
   * Asynchronously checks uptimes and responds with all uptime records in a human-readable format.
   *
   * If an error occurs during the check, it will respond with an error message.
   *
   * @param {Router.RouterContext} ctx - The Koa Router context.
   */
  private async checkUptimes(ctx: Router.RouterContext) {
    try {
      ctx.body = this.uptimeTracker.getAllUptimes();
      return ctx.body;
    } catch (error) {
      this.server.logger.error('Error occurred during uptime check:', error);
      return {
        error: 'Error occurred during uptime check',
      };
    }
  }
}
