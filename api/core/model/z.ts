import { BaseModel } from './t';

class SubModel extends BaseModel<SubModel> {
  constructor() {
    super();
    this.addHook('beforeCreate', this.beforeCreate);
  }

  static beforeCreateHook(instance: SubModel) {
    // Call BaseModel's beforeCreate hook
    BaseModel.beforeCreateHook(instance);

    // SubModel's beforeCreate logic here
  }
}

SubModel.addHook('beforeCreate', SubModel.beforeCreateHook);
