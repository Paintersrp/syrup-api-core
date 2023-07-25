import { ComposedCheck } from './ComposedCheck';
import { SimpleCheck } from './SimpleCheck';
import { HealthCheck } from '../types';

export type CheckType = SimpleCheck | ComposedCheck | DependentCheck;

class DependentCheck {
  name: string;
  dependency: CheckType;
  check: HealthCheck;

  constructor(name: string, dependency: CheckType, check: HealthCheck) {
    this.name = name;
    this.dependency = dependency;
    this.check = check;
  }

  async perform() {
    const dependencyResult = await this.dependency.perform();
    if (!dependencyResult) {
      return false;
    }
    return this.check();
  }
}
