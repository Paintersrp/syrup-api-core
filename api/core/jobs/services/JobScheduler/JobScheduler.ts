import { ScheduleConfig } from '../../Job';

export type Day = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

export class JobScheduler {
  private _cron: string | null = null;
  private _time: string = '00:00';
  private _timeZone: string = 'UTC';
  private _excludeWeekends: boolean = false;
  private _excludeHolidays: Date[] = [];

  daily(): this {
    this._cron = '0 0 * * *';
    return this;
  }

  weekly(dayOfWeek: Day): this {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const dayIndex = days.indexOf(dayOfWeek.toLowerCase());
    if (dayIndex === -1) throw new Error('Invalid day of week');
    this._cron = `0 0 * * ${dayIndex}`;
    return this;
  }

  monthly(dayOfMonth: number): this {
    if (dayOfMonth < 1 || dayOfMonth > 31) throw new Error('Invalid day of month');
    this._cron = `0 0 ${dayOfMonth} * *`;
    return this;
  }

  yearly(dayOfMonth: number, month: number): this {
    if (dayOfMonth < 1 || dayOfMonth > 31) throw new Error('Invalid day of month');
    if (month < 1 || month > 12) throw new Error('Invalid month');
    this._cron = `0 0 ${dayOfMonth} ${month} *`;
    return this;
  }

  customCron(cronExpression: string): this {
    // validate
    this._cron = cronExpression;
    return this;
  }

  at(time: string): this {
    this._time = time;
    return this;
  }

  inTimeZone(timeZone: string): this {
    this._timeZone = timeZone;
    return this;
  }

  excludingWeekends(): this {
    this._excludeWeekends = true;
    return this;
  }

  excludingHolidays(holidays: string[]): this {
    this._excludeHolidays = holidays.map((date) => new Date(date));
    return this;
  }

  toConfig(): ScheduleConfig {
    return {
      cron: this._cron,
      time: this._time,
      timeZone: this._timeZone,
      excludeWeekends: this._excludeWeekends,
      excludeHolidays: this._excludeHolidays,
    };
  }
}
