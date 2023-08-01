export interface IDatabaseStrategy {
  backup(databasePath: string): Promise<string | null>;
  restore(backupPath: string): Promise<boolean>;
}
