import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';

import { Watcher, WatcherConfig, WatcherTask } from './types';
import { PragmaManager } from './PragmaManager';
import { SETTINGS } from '../../../../settings/settings';
import { TemplateManager } from './TemplateManager';
import { Queue } from '../../../structures';
import { debounce } from '../../../lib/debounce';

export class WatcherManager {
  private config: WatcherConfig;
  private templateManager: TemplateManager;
  private debounceDelay: number;

  constructor(config: WatcherConfig, templateManager: TemplateManager, debounceDelay: number) {
    this.config = config;
    this.templateManager = templateManager;
    this.debounceDelay = debounceDelay;
  }

  public init(taskQueue: Queue<WatcherTask>) {
    this.config.watchers.forEach((watcher: Watcher) => {
      const watcherInstance = chokidar.watch(watcher.path, {
        persistent: true,
        ignoreInitial: true,
      });

      let pragmaManager: PragmaManager | undefined;

      if (watcher.pragma) {
        pragmaManager = new PragmaManager(watcher.pragma);
      }

      if (!fs.existsSync(this.getAbsoluteTemplateDir(watcher.path))) {
        console.error(`Template directory ${this.getAbsoluteTemplateDir(watcher.path)} not found.`);
        return;
      }

      if (watcher.type === 'newDir') {
        this.setUpNewDirWatcher(watcher, watcherInstance, taskQueue);
      }

      if (watcher.type === 'newFile') {
        this.setUpNewFileWatcher(watcher, watcherInstance, taskQueue);
      }

      if (pragmaManager) {
        this.setUpFileChangeWatcher(watcherInstance, pragmaManager);
      }
    });
  }

  private getAbsoluteTemplateDir(relativePath: string): string {
    const templateDir = path.basename(relativePath);
    return path.join(SETTINGS.ROOT_DIR as string, 'templates', templateDir);
  }

  private setUpNewDirWatcher(
    watcher: Watcher,
    watcherInstance: chokidar.FSWatcher,
    taskQueue: Queue<WatcherTask>
  ) {
    const absoluteTemplateDir = this.getAbsoluteTemplateDir(watcher.path);
    watcherInstance.on(
      'addDir',
      debounce((newDirPath: string) => {
        this.templateManager.cascadeDirectory(
          newDirPath,
          absoluteTemplateDir,
          watcherInstance,
          taskQueue
        );
      }, this.debounceDelay)
    );
  }

  private setUpNewFileWatcher(
    watcher: Watcher,
    watcherInstance: chokidar.FSWatcher,
    taskQueue: Queue<WatcherTask>
  ) {
    const templateDir = path.basename(watcher.path);
    const absoluteTemplateDir = path.join(SETTINGS.ROOT_DIR as string, 'templates', templateDir);
    const templatePath = path.join(absoluteTemplateDir, `${templateDir}.template.ts`);

    watcherInstance.on(
      'add',
      debounce((newFilePath: string) => {
        if (!fs.existsSync(templatePath)) {
          console.error(`Template file ${templatePath} not found.`);
          return;
        }
        taskQueue.enqueue(() =>
          this.templateManager.createFileFromTemplate(
            path.basename(newFilePath),
            templatePath,
            newFilePath
          )
        );
      }, this.debounceDelay)
    );
  }

  private setUpFileChangeWatcher(
    watcherInstance: chokidar.FSWatcher,
    pragmaManager: PragmaManager
  ) {
    watcherInstance.on(
      'change',
      debounce((changedFilePath: string) => {
        pragmaManager.parseFileForPragmas(changedFilePath);
      }, this.debounceDelay)
    );
  }
}
