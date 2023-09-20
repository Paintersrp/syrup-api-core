import * as Yup from 'yup';

/**
 * A mapping of Sequelize data types to corresponding Yup schema types.
 */
export const sequelizeToYupTypeMap: { [key: string]: Yup.Schema<any> } = {
  STRING: Yup.string(),
  CHAR: Yup.string(),
  TEXT: Yup.string(),
  TINYINT: Yup.number().integer(),
  SMALLINT: Yup.number().integer(),
  MEDIUMINT: Yup.number().integer(),
  INTEGER: Yup.number().integer(),
  BIGINT: Yup.number().integer(),
  FLOAT: Yup.number().typeError('Invalid number'),
  DOUBLE: Yup.number().typeError('Invalid number'),
  DECIMAL: Yup.number().typeError('Invalid number'),
  DATE: Yup.date().typeError('Invalid date'),
  DATEONLY: Yup.date().typeError('Invalid date'),
  BOOLEAN: Yup.boolean(),
  ARRAY: Yup.array(),
  JSON: Yup.mixed(),
  JSONB: Yup.mixed(),
  UUID: Yup.string().matches(/^[a-f\d]{8}(-[a-f\d]{4}){4}[a-f\d]{8}$/i, 'Invalid UUID'),
  ENUM: Yup.string(),
};
