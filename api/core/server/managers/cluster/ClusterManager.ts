import cluster from 'cluster';
import os from 'os';
import { SyLogger } from '../../../logging';

/**
 * Manages the clustering functionality in the application.
 * This class is responsible for determining if the current process is the master or a worker and handling
 * accordingly by either spawning worker processes or starting the server.
 */
export class ClusterManager {
  /**
   * @param {SyLogger} logger - A logging instance to handle logging.
   * @param {() => Promise<void>} start - A method to start the server.
   */
  constructor(private logger: SyLogger, private start: () => Promise<void>) {}

  /**
   * The entry point for clustering functionality.
   * If the process is the master, it spawns as many workers as there are CPU cores.
   * If the process is a worker, it starts the server.
   * @public
   * @async
   * @returns {Promise<void>}
   */
  public async startWithClustering(): Promise<void> {
    if (cluster.isPrimary) {
      const cpuCount = os.cpus().length;

      // Create as many workers as there are CPUs
      for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker) => {
        this.logger.warn(`Worker ${worker.id} has exited.`);
        cluster.fork();
      });
    } else {
      await this.start();
    }
  }
}
