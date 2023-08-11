import { AuditAction, Audit } from '../../models/logging/Audit';

export async function auditLog(model: any, options: any, action: AuditAction) {
  const dataValues = model.dataValues;
  const originalData = model._previousDataValues;

  return await Audit.create(
    {
      action: action,
      model: model.constructor.name,
      beforeData: action === AuditAction.DELETE ? originalData : {},
      afterData: action !== AuditAction.DELETE ? dataValues : null,
      userId: options.context?.id,
      username: options.context?.username,
    },
    { transaction: options.transaction }
  );
}
