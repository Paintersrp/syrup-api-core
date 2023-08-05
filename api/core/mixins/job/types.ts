export type JobTask = () => Promise<void>;

export interface JobHooks {
  onInitialize?: () => void;
  onStart?: () => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}
