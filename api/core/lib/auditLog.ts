import { AuditAction, AuditLog } from '../model/audit';

export async function auditLog(model: any, action: AuditAction) {
  const dataValues = model.dataValues;
  const originalData = model._previousDataValues;

  await AuditLog.create({
    action: action,
    model: model.constructor.name,
    beforeData: action === AuditAction.DELETE ? JSON.stringify(originalData) : {},
    afterData: action !== AuditAction.DELETE ? JSON.stringify(dataValues) : null,
  });
}
