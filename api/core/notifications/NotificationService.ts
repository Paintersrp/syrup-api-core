import { Notification } from '../models/general';
import { TemplateService } from './templates/TemplateService';
import { NotificationPayload } from './types';

/**
 * Service class for handling notifications.
 */
export class NotificationService {
  /**
   * Sends a notification to a user based on a template and optional parameters.
   * @param payload - The notification payload including user ID, template ID, and optional parameters.
   * @returns The created notification.
   * @throws Will throw an error if the template is not found.
   */
  public static async sendNotification(payload: NotificationPayload): Promise<Notification> {
    if (!payload.userId || !payload.templateId) {
      throw new Error('Invalid parameters: userId and templateId are required.');
    }

    const template = await TemplateService.getTemplate(payload.templateId);

    if (!template) {
      throw new Error(`Template with ID ${payload.templateId} not found.`);
    }

    const subject = this.applyTemplateParameters(template.subject, payload.parameters);
    const message = this.applyTemplateParameters(template.content, payload.parameters);

    return Notification.create({
      userId: payload.userId,
      templateId: payload.templateId,
      subject,
      message,
    });
  }

  /**
   * Applies the provided parameters to a template string.
   * @param template - The template string with placeholders.
   * @param parameters - Optional parameters to replace in the template.
   * @returns The processed template string with parameters replaced.
   */
  public static applyTemplateParameters(
    template: string,
    parameters?: Record<string, string>
  ): string {
    if (parameters) {
      for (const [key, value] of Object.entries(parameters)) {
        template = template.replace(new RegExp(`{${key}}`, 'g'), value);
      }
    }
    return template;
  }

  /**
   * Retrieves all notifications for a specific user.
   * @param userId - The user ID to fetch notifications for.
   * @returns An array of notifications for the specified user.
   */
  public static async getUserNotifications(userId: number): Promise<Notification[]> {
    return Notification.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
  }

  /**
   * Retrieves paginated notifications for a specific user.
   * @param userId - The user ID to fetch notifications for.
   * @param page - Current pagination page
   * @param pageSize - Items per page
   * @returns An array of notifications for the specified user.
   */
  public async getPaginatedUserNotifications(
    userId: number,
    page: number = 1,
    pageSize: number = 20
  ): Promise<Notification[]> {
    const results = await Notification.findAndCountAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
    return results.rows;
  }

  /**
   * Marks a specific notification as read.
   * @param notificationId - The ID of the notification to mark as read.
   */
  public static async markNotificationAsRead(notificationId: number): Promise<void> {
    await Notification.update({ read: true }, { where: { id: notificationId } });
  }


}



  //   static async scheduleNotification(payload: NotificationPayload): Promise<Notification<any, any>> {
  //     // Logic to schedule the notification for later, e.g., using a job queue or scheduler
  //     // Replace with actual scheduling logic
  //     return Notification.create(payload); // Example creation without actual scheduling
  //   }

  //   static async getUserNotificationPreferences(userId: number): Promise<any> {
  //     // Fetch user preferences from the User model or another storage system
  //     const user = await User.findByPk(userId);
  //     return user?.notificationPreferences || {}; // Example empty preferences
  //   }

  //   private static isNotificationAllowed(preferences: any, payload: NotificationPayload): boolean {
  //     // Implement logic based on user preferences, notification type, channel, priority, etc.
  //     // Example: Check 'do not disturb' mode, preferred channels, and other settings
  //     return true; // Example: allow all notifications
  //   }