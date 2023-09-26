import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';

import { PragmaService } from './services/PragmaService';
import { TemplateService } from './services/TemplateService';
import { Watcher, WatcherConfig, WatcherTask } from '../types';

import { Queue } from '../../../../structures';
import { debounce } from '../../../../lib/debounce';
import { SETTINGS } from '../../../../../settings/settings';

/**
 * @class WatcherManager
 * Manages various types of file system watchers based on provided configurations.
 */
export class WatcherManager {
  private config: WatcherConfig;
  private templateService: TemplateService;
  private debounceDelay: number;

  /**
   * @constructor
   * @param config - Watcher configurations.
   * @param debounceDelay - Time in milliseconds to debounce events.
   */
  constructor(config: WatcherConfig, debounceDelay: number) {
    this.config = config;
    this.templateService = new TemplateService();
    this.debounceDelay = debounceDelay;
  }

  /**
   * Initializes the watchers based on the provided configuration.
   * @param taskQueue - The queue to which tasks can be added.
   */
  public init(taskQueue: Queue<WatcherTask>) {
    this.config.watchers.forEach((watcher: Watcher) => {
      const watcherInstance = chokidar.watch(watcher.path, {
        persistent: true,
        ignoreInitial: true,
      });

      let pragmaService: PragmaService | undefined;

      if (watcher.pragma) {
        pragmaService = new PragmaService(watcher.pragma);
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

      if (pragmaService) {
        this.setUpFileChangeWatcher(watcherInstance, pragmaService);
      }
    });
  }

  /**
   * @private
   * Resolves the absolute path of the template directory from the relative path.
   * @param relativePath - The relative path to resolve.
   * @returns The absolute path to the template directory.
   */
  private getAbsoluteTemplateDir(relativePath: string): string {
    const templateDir = path.basename(relativePath);
    return path.join(SETTINGS.ROOT_DIR as string, 'templates', templateDir);
  }

  /**
   * @private
   * Sets up a watcher for new directory creation.
   * @param watcher - The watcher configuration.
   * @param watcherInstance - The FSWatcher instance.
   * @param taskQueue - The queue to which tasks can be added.
   */
  private setUpNewDirWatcher(
    watcher: Watcher,
    watcherInstance: chokidar.FSWatcher,
    taskQueue: Queue<WatcherTask>
  ) {
    const absoluteTemplateDir = this.getAbsoluteTemplateDir(watcher.path);
    watcherInstance.on(
      'addDir',
      debounce((newDirPath: string) => {
        this.templateService.cascadeDirectory(
          newDirPath,
          absoluteTemplateDir,
          watcherInstance,
          taskQueue
        );
      }, this.debounceDelay)
    );
  }

  /**
   * @private
   * Sets up a watcher for new file creation.
   * @param watcher - The watcher configuration.
   * @param watcherInstance - The FSWatcher instance.
   * @param taskQueue - The queue to which tasks can be added.
   */
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
          this.templateService.createFileFromTemplate(
            path.basename(newFilePath),
            templatePath,
            newFilePath
          )
        );
      }, this.debounceDelay)
    );
  }

  /**
   * @private
   * Sets up a watcher for file changes to parse pragmas.
   * @param watcherInstance - The FSWatcher instance.
   * @param pragmaManager - An instance of PragmaManager to handle file pragmas.
   */
  private setUpFileChangeWatcher(
    watcherInstance: chokidar.FSWatcher,
    pragmaManager: PragmaService
  ) {
    watcherInstance.on(
      'change',
      debounce((changedFilePath: string) => {
        pragmaManager.parseFileForPragmas(changedFilePath);
      }, this.debounceDelay)
    );
  }
}
