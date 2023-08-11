import { randomUUID } from 'crypto';
import { SyLogger } from '../../../logging';
import { LifecycleManager } from '../lifecycle/LifecycleManager';

/**
 * Manages various process events such as unhandled rejections,
 * uncaught exceptions, and system signals (SIGTERM and SIGINT).
 * This is essential to capture and log unexpected errors and gracefully shut down the server.
 */
export class EventManager {
  /**
   * @param {SyLogger} logger - A logging instance to handle error logging.
   * @param {LifecycleManager} lifecycleManager - A lifecycle manager that includes the gracefulShutdown method.
   */
  constructor(private logger: SyLogger, lifecycleManager: LifecycleManager) {
    this.initEventHandlers(lifecycleManager.gracefulShutdown);
  }

  /**
   * Initializes event handlers for handling unexpected events within the process.
   * These include unhandled rejections, uncaught exceptions, and system signals (SIGTERM, SIGINT).
   * @public
   * @param {() => Promise<void>} gracefulShutdown - The method to call for gracefully shutting down the server.
   */
  public initEventHandlers(gracefulShutdown: () => Promise<void>) {
    process.on('unhandledRejection', (reason, promise) => {
      const errorId = randomUUID();
      this.logger.error('Unhandled Rejection', {
        promise,
        reason,
        errorId,
      });
    });

    process.on('uncaughtException', (error) => {
      const errorId = randomUUID();
      this.logger.error('Uncaught Exception', { error, errorId });
      process.exit(1);
    });

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  }
}
