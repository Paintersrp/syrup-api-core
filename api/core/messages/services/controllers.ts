import { BaseMessages, BaseMessagesInteface } from '../base';

type CRUDActions = 'create' | 'read' | 'update' | 'delete';

interface ControllerMessagesInterface extends BaseMessagesInteface<CRUDActions> {
  MODEL_NOT_FOUND: (modelName: string) => string;
  VALIDATION_FAIL: (modelName: string, field: string) => string;
}

export const ControllerMessages: ControllerMessagesInterface = {
  ...BaseMessages,
  MODEL_NOT_FOUND: (modelName) => `${modelName} not found`,
  VALIDATION_FAIL: (modelName, field) => `Validation failed for ${field} in ${modelName}`,
};
