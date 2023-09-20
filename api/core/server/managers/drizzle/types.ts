/**
 * Defines the basic configuration for a single file watcher.
 */
export interface Watcher {
  /** Path to be watched */
  path: string;

  /** Type of watcher, either for a new directory or a new file */
  type: 'newDir' | 'newFile';

  /** Optional pragma configuration */
  pragma?: WatcherPragmaConfig;
}

/**
 * Configuration for multiple watchers.
 */
export interface WatcherConfig {
  /** Array of watchers */
  watchers: Watcher[];
}

export interface WatcherPragmaConfig {
  /** General Pragmas */
  [key: string]: WatcherPragma;

  /** Specialized Pragma */
  drizzle: WatcherPragma;

  /** Specialized Pragma */
  pour: WatcherPragma;
}

/**
 * A task to be performed by a watcher.
 */
export type WatcherTask = () => void;

/**
 * Defines the shape of a watcher pragma.
 */
export interface WatcherPragma {
  /** Pragma Function */
  [pragma: string]: Function;
}
