import { Time } from './time';

/**
 * Enum for interval times.
 *
 * @enum {number}
 */
export enum Interval {
  Hourly = Time.Hours,
  Bidaily = 2 * Time.Days,
  Daily = Time.Days,
  Triweekly = 3 * Time.Days,
  Weekly = Time.Weeks,
  Biweekly = 2 * Time.Weeks,
  Monthly = Time.Months,
  Quarterly = 3 * Time.Months,
  Biannually = 6 * Time.Months,
  Annually = Time.Years,
  Biennially = 2 * Time.Years,
  Decennially = 10 * Time.Years,
  Centennially = 100 * Time.Years,
}
