import { Model } from 'sequelize';

export const ControllerResponses = {
  CREATE_SUCCESS: (modelName: string) => `${modelName} created successfully`,
  CREATE_FAIL: (modelName: string) => `Failed to create ${modelName}`,
  READ_SUCCESS: (modelName: string) => `${modelName} read successfully`,
  READ_FAIL: (modelName: string) => `Failed to read ${modelName}`,
  UPDATE_SUCCESS: (modelName: string) => `${modelName} updated successfully`,
  UPDATE_FAIL: (modelName: string) => `Failed to update ${modelName}`,
  DELETE_SUCCESS: (modelName: string) => `${modelName} deleted successfully`,
  DELETE_FAIL: (modelName: string) => `Failed to delete ${modelName}`,
  META_SUCCESS: (modelName: string) => `Failed to delete ${modelName}`,
  META_FAIL: (modelName: string) => `Failed to delete ${modelName}`,
  MODEL_NOT_FOUND: (modelName: string) => `${modelName} not found`,
};
