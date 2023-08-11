import Koa from 'koa';
import { SyLogger } from '../../../logging';
import { CacheManager } from '../cache/CacheManager';
import { DatabaseManager } from '../database/DatabaseManager';
import { Server } from 'http';

/**
 * Manages the lifecycle of the server, including starting, graceful shutdown,
 * and (optionally) SSL management.
 */
export class LifecycleManager {
  /**
   * @param {Koa} app - The Koa application instance.
   * @param {number} port - The port on which the server should listen.
   * @param {SyLogger} logger - A logging instance.
   * @param {CacheManager} cacheManager - Cache manager to handle cache operations.
   * @param {DatabaseManager} databaseManager - Database manager to handle database operations.
   * @param {Server} [server] - Optional server instance.
   */
  constructor(
    private app: Koa,
    private port: number,
    private logger: SyLogger,
    private cacheManager: CacheManager,
    private databaseManager: DatabaseManager,
    private server?: Server
  ) {}

  /**
   * Starts the server by initializing the database and cache,
   * and starting the HTTP server to listen on the specified port.
   * @public
   * @returns {Promise<void>}
   */
  public async start(): Promise<void> {
    try {
      await this.databaseManager.startDatabase();
      await this.cacheManager.start();

      this.server = this.app.listen(this.port, () => {
        this.logger.info(`Server running on http://localhost:${this.port}`);
      });
    } catch (error: any) {
      this.logger.error('Error starting server:', error);
      process.exit(1);
    }
  }

  /**
   * Gracefully shuts down the server, closes the cache,
   * and handles any cleanup before exiting the process.
   * @public
   * @returns {Promise<void>}
   */
  public async gracefulShutdown(): Promise<void> {
    this.logger.info('Server is shutting down...');
    await this.cacheManager.close();
    await this.databaseManager.backupDatabase();

    this.server?.close((error) => {
      if (error) {
        this.logger.error('Error while closing the server:', error);
        process.exit(1);
      } else {
        this.logger.info('Graceful shutdown complete.');
        process.exit(0);
      }
    });
  }
}

/**
 * SSL Version
 */

// protected async start() {
//   try {
//     await this.ORM.startDatabase();
//     await this.cache.start();

//     // Read the SSL key and certificate
//     const sslOptions = {
//       key: fs.readFileSync('<path-to-private-key>'),
//       cert: fs.readFileSync('<path-to-certificate>')
//     };

//     // Use http2 to create a secure server
//     this.server = http2.createSecureServer(sslOptions, this.app.callback()).listen(this.port, () => {
//       this.logger.info(`Server running on http://localhost:${this.port}`);
//     });

//     // Use http3 to create a secure server
//     // this.server = http3.createSecureServer(sslOptions, this.app.callback()).listen(this.port, () => {
//     //   this.logger.info(`Server running on http://localhost:${this.port}`);
//     // });

//   } catch (error) {
//     this.logger.error('Error starting server:', error);
//     process.exit(1);
//   }

//   this.initEventHandlers();
// }

/**
 * SSL Auto Updating
 */

// import autoRenewSSL from 'node-auto-renew-ssl';

// // ...

// async updateCertificates() {
//   try {
//     await autoRenewSSL.renewSSL({
//       email: '<your-email>', // replace with your email
//       domains: ['<your-domain>'], // replace with your domain
//       renewWithin: 15, // number of days to renew the certificate within
//       sslDirPath: '<path-to-ssl-dir>' // replace with the path to your ssl directory
//     });
//     this.logger.info('Server certificates have been updated');
//   } catch (error) {
//     this.logger.error('Error updating certificates:', error);
//   }
// }
