import { SETTINGS } from '../../../../settings/settings';

import { WatcherTask } from './types';
import { QueueManager } from './queue/QueueManager';
import { WatcherManager } from './watcher/WatcherManager';

/**
 * @class DrizzleManager
 * Manages the coordination of file system watching, task queuing, and template management.
 */
export class DrizzleManager {
  /**
   * @private
   * @type {QueueManager<WatcherTask>}
   * Manages the queue of tasks to be executed.
   */
  private queueManager: QueueManager<WatcherTask>;

  /**
   * @private
   * @type {WatcherManager}
   * Manages file and directory watching.
   */
  private watcherManager: WatcherManager;

  /**
   * @constructor
   * @param {number} [debounceDelay=500] - Delay in milliseconds to debounce watcher events.
   * Initializes the templateManager, queueManager, and watcherManager, and starts processing.
   */
  constructor(debounceDelay: number = 500) {
    this.queueManager = new QueueManager<WatcherTask>();
    this.watcherManager = new WatcherManager(SETTINGS.DRIZZLE, debounceDelay);

    this.initializeWatchers();
    this.processQueue();
  }

  /**
   * @private
   * Starts the processing of the task queue.
   * Delegates the queue processing to the queueManager.
   */
  private processQueue() {
    this.queueManager.processQueue();
  }

  /**
   * @public
   * Initializes all watchers for file and directory changes.
   * Delegates the watcher initialization to the watcherManager.
   */
  public initializeWatchers() {
    this.watcherManager.init(this.queueManager.getQueue());
  }
}
