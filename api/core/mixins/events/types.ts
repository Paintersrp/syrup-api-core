export type EventListener = (event: string, ...args: any[]) => void;
export type EventMiddleware = (event: string, ...args: any[]) => boolean | void;
export type ConditionFunction = (...args: any[]) => boolean;

/**
 * Data structure representing a single event.
 */
export interface EventData {
  /** The callback function for the event. */
  listener: EventListener;

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
  listeners: EventListener[];
  lastTriggered: number[];
  conditions: ConditionFunction[];
  metadata: Record<string, any>[];
  priority: number[];
};
