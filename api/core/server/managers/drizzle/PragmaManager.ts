import fs from 'fs';
import { Queue } from '../../../structures';
import { WatcherPragmaConfig, WatcherTask } from './types';

export class PragmaManager {
  private config: WatcherPragmaConfig;
  private taskQueue: Queue<WatcherTask>;

  constructor(config: WatcherPragmaConfig) {
    this.config = config;
    this.taskQueue = new Queue<WatcherTask>();
    this.processQueue();
  }

  public parseFileForPragmas(filePath: string) {
    const fileContent = fs.readFileSync(filePath, 'utf8');

    if (fileContent.includes('// @pause')) {
      console.log('Pragma based generation is paused.');
      return;
    }

    const lines = fileContent.split('\n');

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('// @drizzle') || trimmedLine.startsWith('// @pour')) {
        const parsedPragma = this.parsePragma(line);
        const taskFunction = this.config[parsedPragma.type][parsedPragma.key];

        if (taskFunction) {
          this.taskQueue.enqueue(() => taskFunction(parsedPragma.params, filePath, index));
        }
      }
    });
  }

  private parsePragma(pragmaLine: string): {
    type: string;
    key: string;
    params: any;
  } {
    const pragmaRegex = /@(drizzle|pour)\.(\w+)\((.*)\)/;
    const match = pragmaRegex.exec(pragmaLine);

    if (!match) {
      return { type: '', key: '', params: {} };
    }

    const [, type, key, paramString] = match;
    const params: { [key: string]: any } = {};

    const paramsRegex = /(\w+)=([a-zA-Z0-9_]+|true|false)/g;
    let paramMatch;

    while ((paramMatch = paramsRegex.exec(paramString)) !== null) {
      const [, paramKey, paramValue] = paramMatch;
      params[paramKey] = isNaN(Number(paramValue))
        ? paramValue === 'true'
          ? true
          : paramValue === 'false'
          ? false
          : paramValue
        : Number(paramValue);
    }

    return { type, key, params };
  }

  private processQueue() {
    if (!this.taskQueue.isEmpty()) {
      const task = this.taskQueue.dequeue();
      task!();
    }
    setTimeout(() => this.processQueue(), 0);
  }
}
