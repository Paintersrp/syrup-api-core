import path from 'path';
import { BasePathStructure } from './types';

export class PathResolver<T extends BasePathStructure> {
  private basePath: string;
  private structure: T;

  constructor(basePath: string, structure: T) {
    this.basePath = basePath;
    this.structure = this.resolvePaths(structure);
  }

  private resolvePaths(structure: T, currentPath: string = ''): T {
    return Object.entries(structure).reduce((acc: any, [key, value]) => {
      const newPath = path.join(currentPath, key);
      if (value === null) {
        acc[key] = path.join(this.basePath, newPath);
      } else {
        acc[key] = this.resolvePaths(value as T, newPath);
      }
      return acc;
    }, {} as T);
  }

  get paths() {
    return this.structure;
  }
}
