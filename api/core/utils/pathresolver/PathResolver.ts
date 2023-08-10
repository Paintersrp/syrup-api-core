import path from 'path';
import fs from 'fs';
import { BasePathStructure, PathResolverFunction, PathType } from './types';

/**
 * PathResolver class to manage and resolve a structure of paths.
 *
 * @typeparam T Type representing the structure of paths.
 */
export class PathResolver<T extends BasePathStructure> {
  private basePath: string;
  private structure: T;
  private resolvedStructure?: T;
  private resolverFunction?: PathResolverFunction;
  private validatePaths: boolean;

  /**
   * Constructs a PathResolver instance.
   *
   * @param basePath The base path for resolving paths.
   * @param structure The structure representing the paths.
   * @param resolverFunction Optional custom function to resolve paths.
   * @param validatePaths Optional flag to validate if paths exist. Default is `false`.
   */
  constructor(
    basePath: string,
    structure: T,
    resolverFunction?: PathResolverFunction,
    validatePaths: boolean = false
  ) {
    this.basePath = basePath;
    this.structure = structure;
    this.resolverFunction = resolverFunction;
    this.validatePaths = validatePaths;
  }

  /**
   * Recursively resolves paths in the structure.
   * @private
   */
  private resolvePaths(structure: T, currentPath: string = ''): T {
    return Object.entries(structure).reduce((acc: any, [key, value]) => {
      const newPath = this.resolverFunction
        ? this.resolverFunction(currentPath, key, value)
        : path.join(currentPath, key);

      if (value === null) {
        const resolvedPath = path.join(this.basePath, newPath);

        if (this.validatePaths && !fs.existsSync(resolvedPath)) {
          throw new Error(`Path does not exist: ${resolvedPath}`);
        }

        acc[key] = resolvedPath;
      } else {
        acc[key] = this.resolvePaths(value as T, newPath);
      }

      return acc;
    }, {} as T);
  }

  /**
   * Provides the resolved structure of paths.
   * @readonly
   */
  public get paths(): Readonly<T> {
    if (!this.resolvedStructure) {
      this.resolvedStructure = this.resolvePaths(this.structure);
    }
    return this.resolvedStructure;
  }

  /**
   * Retrieves the resolved path by key.
   *
   * @param key The key to retrieve the path.
   * @returns The path associated with the key.
   */
  public getPath(key: keyof T): PathType {
    return this.paths[key as string];
  }

  /**
   * Sets a path value by key.
   *
   * @param key The key to set the path.
   * @param value The value of the path to set.
   * @throws Error if the key does not exist in the path structure.
   */
  public setPath(key: keyof T, value: string) {
    if (this.structure[key] === undefined) {
      throw new Error(`Key "${String(key)}" does not exist in the path structure.`);
    }
    this.structure[key] = value as any;
    this.resolvedStructure = undefined;
  }

  /**
   * Ensures that all directories in the paths exist, creating them if necessary.
   */
  public ensureDirectories() {
    for (const path of Object.values(this.paths)) {
      if (typeof path === 'string' && !fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
    }
  }
}
