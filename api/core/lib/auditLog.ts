import { AuditAction, AuditLog } from '../models/auditlog';

export async function auditLog(model: any, options: any, action: AuditAction) {
  const dataValues = model.dataValues;
  const originalData = model._previousDataValues;

  await AuditLog.create(
    {
      action: action,
      model: model.constructor.name,
      beforeData: action === AuditAction.DELETE ? JSON.stringify(originalData) : {},
      afterData: action !== AuditAction.DELETE ? JSON.stringify(dataValues) : null,
      userId: options.context?.id,
      username: options.context?.username,
    },
    { transaction: options.transaction }
  );
}
