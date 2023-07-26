// import { Model, DataTypes } from 'sequelize';

// export class AuditLog extends Model {
//   public id!: number;
//   public action!: string;
//   public model!: string;
//   public beforeData!: string;
//   public afterData!: string;
// }

// AuditLog.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     action: {
//       type: new DataTypes.STRING(128),
//       allowNull: false,
//     },
//     model: {
//       type: new DataTypes.STRING(128),
//       allowNull: false,
//     },
//     beforeData: {
//       type: new DataTypes.STRING(10000),
//       allowNull: false,
//     },
//     afterData: {
//       type: new DataTypes.STRING(10000),
//       allowNull: false,
//     },
//   },
//   {
//     tableName: 'audit_logs',
//     sequelize: ORM.database, // your sequelize instance
//   }
// );

// UserModel.addHook('afterUpdate', async (user, options) => {
//   const changedData = user.get({ plain: true });
//   const originalData = user.previous('changedData');
//   await AuditLog.create({
//     action: 'update',
//     model: 'User',
//     beforeData: JSON.stringify(originalData),
//     afterData: JSON.stringify(changedData),
//   });
// });

// UserModel.addHook('afterCreate', async (user, options) => {
//   const newData = user.get({ plain: true });
//   await AuditLog.create({
//     action: 'create',
//     model: 'User',
//     beforeData: JSON.stringify({}),
//     afterData: JSON.stringify(newData),
//   });
// });

// UserModel.addHook('afterDestroy', async (user, options) => {
//   const deletedData = user.get({ plain: true });
//   await AuditLog.create({
//     action: 'delete',
//     model: 'User',
//     beforeData: JSON.stringify(deletedData),
//     afterData: JSON.stringify({}),
//   });
// });
