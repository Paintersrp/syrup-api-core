import { Scheduler } from '../scheduler';
import { Job } from '../jobs';
import { ReportProfile } from './types';

/**
 * The ReportManager class provides methods for managing a collection of report profiles.
 * Each report profile is associated with a job that is scheduled to run at a certain time.
 */
export class ReportManager {
  private reportProfiles: ReportProfile[];
  private scheduler: Scheduler;

  /**
   * Creates a new ReportManager.
   * @param reportProfiles - An array of report profiles to be managed.
   */
  constructor(reportProfiles: ReportProfile[]) {
    this.reportProfiles = reportProfiles;
    this.scheduler = new Scheduler();

    this.initializeReports();
  }

  /**
   * Initializes the reports by creating and scheduling jobs for each report profile.
   */
  private initializeReports() {
    this.reportProfiles.forEach((profile) => {
      const job = new Job({
        name: profile.name,
        task: async () => {
          profile.generator.analyzeLogs();
          profile.generator.clearLogs();
        },
        schedule: profile.schedule,
        hooks: profile.hooks,
      });

      this.scheduler.addJob(job);
    });
  }

  /**
   * Starts a report.
   * @param name - The name of the report to be started.
   */
  public startReport(name: string) {
    this.scheduler.startJob(name);
  }

  /**
   * Stops a report.
   * @param name - The name of the report to be stopped.
   */
  public stopReport(name: string) {
    this.scheduler.stopJob(name);
  }

  /**
   * Reschedules a report.
   * @param name - The name of the report to be rescheduled.
   * @param schedule - The new schedule for the report.
   */
  public rescheduleReport(name: string, schedule: string) {
    this.scheduler.rescheduleJob(name, schedule);
  }

  /**
   * Adds a report profile.
   * @param profile - The report profile to be added.
   */
  public addReportProfile(profile: ReportProfile) {
    const job = new Job({
      name: profile.name,
      task: async () => {
        profile.generator.analyzeLogs();
      },
      schedule: profile.schedule,
      hooks: profile.hooks,
    });

    this.reportProfiles.push(profile);
    this.scheduler.addJob(job);
  }

  /**
   * Removes a report profile.
   * @param name - The name of the report profile to be removed.
   */
  public removeReportProfile(name: string) {
    const index = this.reportProfiles.findIndex((profile) => profile.name === name);
    if (index !== -1) {
      this.scheduler.removeJob(name);
      this.reportProfiles.splice(index, 1);
    }
  }
}
