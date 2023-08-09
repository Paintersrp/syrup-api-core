export type EmitterListener = (event: string, ...args: any[]) => void;
export type EmitterMiddleware = (event: string, ...args: any[]) => boolean | void;
export type ConditionFunction = (...args: any[]) => boolean;

/**
 * Data structure representing a single event.
 */
export interface EmitterData {
  /** The callback function for the event. */
  listener: EmitterListener;

  /** Priority of the event listener. */
  priority: number;

  /** Metadata associated with the event listener. */
  metadata: Record<string, any>;

  /** Condition under which the listener should be invoked. */
  condition: ConditionFunction;

  /** Timestamp when the event was last triggered. */
  lastTriggered: number;
}

export type Event = {
  listeners: EmitterListener[];
  lastTriggered: number[];
  conditions: ConditionFunction[];
  metadata: Record<string, any>[];
  priority: number[];
};
