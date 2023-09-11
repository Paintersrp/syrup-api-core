import { JobHooks, JobTask } from '../../types';

export type HookCallback = () => void;

export class JobLifecycle {
  private hooks: { [key: keyof JobHooks]: JobTask[] };

  constructor(hooks: JobHooks | undefined) {
    this.hooks = hooks || {};
  }

  registerHook(event: keyof JobHooks, callback: JobTask): void {
    this.hooks[event] = this.hooks[event] || [];
    this.hooks[event].push(callback);
  }

  unregisterHook(event: keyof JobHooks, callback: JobTask): void {
    if (this.hooks[event]) {
      this.hooks[event] = this.hooks[event].filter((cb) => cb !== callback);
    }
  }

  async executeHook(event: keyof JobHooks): Promise<void> {
    if (this.hooks[event]) {
      for (const callback of this.hooks[event]) {
        await callback();
      }
    }
  }

  getHooks(): { [key: keyof JobHooks]: JobTask[] } {
    return this.hooks;
  }

  clearHooks(event?: string): void {
    if (event) {
      delete this.hooks[event];
    } else {
      this.hooks = {};
    }
  }
}
