import { Model } from 'sequelize';

export class BaseModel<T extends Model> extends Model {
  // Define your audit log fields here

  constructor() {
    super();
    this.addHook('beforeCreate', this.logCreate);
    this.addHook('beforeUpdate', this.logUpdate);
    this.addHook('beforeDestroy', this.logDelete);
  }

  logCreate(instance: T) {
    // Log creation
  }

  logUpdate(instance: T) {
    // Log update
  }

  logDelete(instance: T) {
    // Log deletion
  }

  static beforeCreateHook(instance: any) {
    // BaseModel's beforeCreate logic here
  }
}

BaseModel.addHook('beforeCreate', BaseModel.beforeCreateHook);
