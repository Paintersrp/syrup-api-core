/**
 * Enum for various time units in milliseconds.
 *
 * @enum {number}
 */
export enum Time {
  Milliseconds = 1,
  Seconds = 1_000 * Milliseconds,
  Minutes = 60 * Seconds,
  Hours = 60 * Minutes,
  Days = 24 * Hours,
  Weeks = 7 * Days,
  Months = (365.2425 / 12) * Days,
  Years = 365.2425 * Days,
}
