import fs from 'fs';
import { Queue } from '../../../../../structures';
import { WatcherPragmaConfig, WatcherTask } from '../../types';

/**
 * @class PragmaService
 * Manages the extraction and processing of pragmas from source files.
 */
export class PragmaService {
  private config: WatcherPragmaConfig;
  private taskQueue: Queue<WatcherTask>;

  constructor(config: WatcherPragmaConfig) {
    this.config = config;
    this.taskQueue = new Queue<WatcherTask>();
    this.startQueueProcessing();
  }

  /**
   * @public
   * Parses the file content for pragma statements and enqueues tasks.
   * @param filePath - The path to the source file.
   */
  public parseFileForPragmas(filePath: string) {
    const fileContent = fs.readFileSync(filePath, 'utf8');

    if (this.isGenerationPaused(fileContent)) return;

    const lines = fileContent.split('\n');
    lines.forEach((line, index) => this.processLineForPragma(line, filePath, index));
  }

  /**
   * @private
   * Checks if generation is paused via a pragma in the file content.
   * @param fileContent - The content of the file.
   */
  private isGenerationPaused(fileContent: string): boolean {
    if (fileContent.includes('// @pause')) {
      console.log('Pragma based generation is paused.');
      return true;
    }
    return false;
  }

  /**
   * @private
   * Processes a single line for potential pragmas and enqueues tasks accordingly.
   * @param line - A single line from the source file.
   * @param filePath - The path to the source file.
   * @param index - The index of the line in the source file.
   */
  private processLineForPragma(line: string, filePath: string, index: number) {
    const trimmedLine = line.trim();
    if (this.isPragmaLine(trimmedLine)) {
      const parsedPragma = this.parsePragma(line);
      const taskFunction = this.config[parsedPragma.type][parsedPragma.key];
      if (taskFunction) {
        this.taskQueue.enqueue(() => taskFunction(parsedPragma.params, filePath, index));
      }
    }
  }

  /**
   * @private
   * Checks if a line starts with a recognized pragma keyword.
   * @param line - A line to check.
   */
  private isPragmaLine(line: string): boolean {
    return line.startsWith('// @drizzle') || line.startsWith('// @pour');
  }

  /**
   * @private
   * Parses a pragma line to extract type, key, and params.
   * @param pragmaLine - A line containing a pragma.
   * @returns An object containing the type, key, and params extracted from the line.
   */
  private parsePragma(pragmaLine: string): {
    type: string;
    key: string;
    params: { [key: string]: any };
  } {
    const match = this.matchPragma(pragmaLine);
    if (!match) {
      return { type: '', key: '', params: {} };
    }

    const { type, key, paramString } = match;
    const params = this.parseParams(paramString);

    return { type, key, params };
  }

  /**
   * @private
   * Matches a pragma line against a predefined regular expression.
   * @param pragmaLine - A line containing a pragma.
   * @returns An object containing the type, key, and paramString if matched, null otherwise.
   */
  private matchPragma(
    pragmaLine: string
  ): { type: string; key: string; paramString: string } | null {
    const pragmaRegex = /@(drizzle|pour)\.(\w+)\((.*)\)/;
    const match = pragmaRegex.exec(pragmaLine);

    if (!match) {
      return null;
    }

    const [, type, key, paramString] = match;
    return { type, key, paramString };
  }

  /**
   * @private
   * Parses the parameters from the paramString.
   * @param paramString - The parameter string to parse.
   * @returns An object containing the parsed parameters.
   */
  private parseParams(paramString: string): { [key: string]: any } {
    const params: { [key: string]: any } = {};
    const paramsRegex = /(\w+)=([a-zA-Z0-9_]+|true|false)/g;
    let paramMatch;

    while ((paramMatch = paramsRegex.exec(paramString)) !== null) {
      const [, paramKey, paramValue] = paramMatch;
      params[paramKey] = this.convertParamValue(paramValue);
    }

    return params;
  }

  /**
   * @private
   * Converts the param value to its appropriate type.
   * @param paramValue - The value to convert.
   * @returns The converted value.
   */
  private convertParamValue(paramValue: string): any {
    return isNaN(Number(paramValue))
      ? paramValue === 'true'
        ? true
        : paramValue === 'false'
        ? false
        : paramValue
      : Number(paramValue);
  }

  /**
   * @private
   * Starts the processing of the task queue.
   */
  private startQueueProcessing() {
    if (!this.taskQueue.isEmpty()) {
      const task = this.taskQueue.dequeue();
      task!();
    }
    setTimeout(() => this.startQueueProcessing(), 0);
  }
}
