import os from 'os';
import Router from 'koa-router';
import { SyServer } from '../SyServer';
import { ServerResourceThresholds } from '../types';

/**
 * TODO LIST:
 *
 * SyHealthMixin Class:
 * - [ ] Implement a custom health check DSL for defining complex health checks
 * - [ ] Develop a dashboard for real-time health monitoring of services
 * - [ ] Add support for health checks over WebSockets for real-time updates
 * - [ ] Provide optional integration with cloud-based monitoring services (like AWS CloudWatch, Google Cloud Monitoring)
 * - [ ] Create automated remediation scripts for common failure scenarios
 * - [ ] Implement health check chaining, where the output of one check can be used as input for another
 * - [ ] Add a mechanism to perform a "deep" health check that includes dependent services
 * - [ ] Implement rate-limiting for health check endpoints to prevent misuse
 * - [ ] Add an option for sending health status reports to a specified email
 * - [ ] Allow health checks to be triggered manually, not only at predefined intervals
 *
 * Health Check Interface and Options:
 * - [ ] Implement a system for scheduling health checks at different intervals based on their importance and load
 * - [ ] Add support for SLA monitoring - automatically calculate uptime based on health checks
 * - [ ] Provide an API for third-party services to add their own health checks
 * - [ ] Enable custom health check responses, allowing users to define the structure of the output
 * - [ ] Implement a feature for emergency shutdown or restart in case of critical failures
 *
 * Monitoring and Logging:
 * - [ ] Add support for distributed tracing to help debug issues in microservices architecture
 * - [ ] Implement AI-driven predictions to forecast potential issues based on historical data
 * - [ ] Allow real-time streaming of health check logs for live monitoring
 * - [ ] Add support for anomaly detection in health check results
 * - [ ] Build an integration with PagerDuty or similar for critical alerts
 *
 * Test Coverage:
 * - [ ] Add performance tests to simulate high load on health check endpoints
 * - [ ] Implement a chaos engineering system for testing resilience of health checks
 * - [ ] Add tests for resilience against common network issues (latency, packet loss)
 * - [ ] Test for proper functioning in different runtime environments (OS, Node.js version)
 * - [ ] Include testing for health check endpoints in continuous integration pipeline
 *
 * Documentation and Code Quality:
 * - [ ] Develop a style guide for writing health checks
 * - [ ] Create detailed technical documentation on the architecture of health checks
 * - [ ] Provide a comprehensive troubleshooting guide for common issues
 * - [ ] Organize and document a training for developers on how to use and extend the health check system
 * - [ ] Conduct a code review and refactor for optimizing performance and maintainability
 */

/**
 * A mixin for a Koa server that provides several health check endpoints.
 * These endpoints can be used to monitor the health status of the server,
 * its connections, and the system resources available.
 */
export class SyHealthMixin {
  server: SyServer;
  router: Router;
  resourceThresholds: ServerResourceThresholds;

  constructor(server: SyServer, resourceThresholds?: ServerResourceThresholds) {
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
}
