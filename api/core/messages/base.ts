export interface BaseMessagesInteface<T> {
  SUCCESS: (entityName: string, action: T) => string;
  FAIL: (entityName: string, action: T) => string;
  INFO: (details: string) => string;
  WARN: (details: string) => string;
}

export const BaseMessages: BaseMessagesInteface<string> = {
  SUCCESS: (entityName, action) => `${entityName} ${action} successful`,
  FAIL: (entityName, action) => `${entityName} ${action} failed`,
  INFO: (details) => `Info: ${details}`,
  WARN: (details) => `Warning: ${details}`,
};
