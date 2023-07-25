import { HealthCheckWithRemediation } from '../types';

export class SimpleCheck {
  public name: string;
  public check: HealthCheckWithRemediation;

  constructor(name: string, check: HealthCheckWithRemediation) {
    this.name = name;
    this.check = check;
  }

  async perform() {
    return this.check.check();
  }
}
