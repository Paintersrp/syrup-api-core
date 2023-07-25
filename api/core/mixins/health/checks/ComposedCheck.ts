import { SimpleCheck } from './SimpleCheck';

export class ComposedCheck {
  public name: string;
  public checks: SimpleCheck[];

  constructor(name: string, checks: SimpleCheck[]) {
    this.name = name;
    this.checks = checks;
  }

  async perform() {
    const results = await Promise.all(this.checks.map((check) => check.perform()));
    return results.every((result) => result);
  }
}
