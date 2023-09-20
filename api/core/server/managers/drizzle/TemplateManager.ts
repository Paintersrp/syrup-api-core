import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';
import { WatcherTask } from './types';
import { Queue } from '../../../structures';

export class TemplateManager {
  public async createFileFromTemplate(newDirName: string, templatePath: string, destPath: string) {
    try {
      await this.writeFileFromTemplate(newDirName, templatePath, destPath);
    } catch (error: any) {
      console.error(`Error creating dynamic file: ${error}`);
    }
  }

  private async writeFileFromTemplate(newDirName: string, templatePath: string, destPath: string) {
    const capitalizedDirName = this.capitalizeFirstLetter(newDirName);
    const templateFunction = this.getTemplateFunction(templatePath);
    const content = templateFunction(capitalizedDirName);
    fs.writeFileSync(destPath, content);
  }

  private capitalizeFirstLetter(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  private getTemplateFunction(templatePath: string): Function {
    return require(templatePath).default || require(templatePath);
  }

  public async cascadeDirectory(
    newDirPath: string,
    templateDirPath: string,
    watcherInstance: chokidar.FSWatcher,
    taskQueue: Queue<WatcherTask>
  ) {
    watcherInstance.unwatch(newDirPath);

    try {
      await this.processFiles(newDirPath, templateDirPath, watcherInstance, taskQueue);
    } catch (error: any) {
      console.error(`Error cascading directory: ${error.message}`);
    }

    watcherInstance.add(newDirPath);
  }

  private async processFiles(
    newDirPath: string,
    templateDirPath: string,
    watcherInstance: chokidar.FSWatcher,
    taskQueue: Queue<WatcherTask>
  ) {
    const files = fs.readdirSync(templateDirPath);
    const newDirName = path.basename(newDirPath);

    files.forEach((file) => {
      const templatePath = path.join(templateDirPath, file);
      const destPath = path.join(newDirPath, file.replace('.template', ''));

      const stat = fs.statSync(templatePath);
      if (stat.isDirectory()) {
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath);
        }
        this.cascadeDirectory(destPath, templatePath, watcherInstance, taskQueue);
      } else {
        taskQueue.enqueue(() => this.writeFileFromTemplate(newDirName, templatePath, destPath));
      }
    });
  }
}
