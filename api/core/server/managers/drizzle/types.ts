export type Watcher = {
  path: string;
  type: 'newDir' | 'newFile';
  pragma?: WatcherPragmaConfig;
};

export interface WatcherConfig {
  watchers: Watcher[];
}

export type WatcherPragmaConfig = {
  [key: string]: WatcherPragma;
  drizzle: WatcherPragma;
  pour: WatcherPragma;
};

export type WatcherTask = () => void;

export type WatcherPragma = { [pragma: string]: Function };
