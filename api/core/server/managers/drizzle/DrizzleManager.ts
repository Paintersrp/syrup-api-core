import { SETTINGS } from '../../../../settings/settings';

import { WatcherTask } from './types';
import { TemplateManager } from './TemplateManager';
import { QueueManager } from './QueueManager';
import { WatcherManager } from './WatcherManager';

export class DrizzleManager {
  private templateManager: TemplateManager;
  private queueManager: QueueManager<WatcherTask>;
  private watcherManager: WatcherManager;

  constructor(debounceDelay: number = 500) {
    this.templateManager = new TemplateManager();
    this.queueManager = new QueueManager<WatcherTask>();
    this.watcherManager = new WatcherManager(SETTINGS.DRIZZLE, this.templateManager, debounceDelay);

    this.initializeWatchers();
    this.processQueue();
  }

  private processQueue() {
    this.queueManager.processQueue();
  }

  public initializeWatchers() {
    this.watcherManager.init(this.queueManager.getQueue());
  }
}
