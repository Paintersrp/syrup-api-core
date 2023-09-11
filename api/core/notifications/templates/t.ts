import { Notification } from '../../models/general';
import { TEMPLATES, TemplateMapping } from './templates';

export class NotificationBuilder {
  private template?: TemplateMapping[keyof TemplateMapping];

  setTemplate<K extends keyof TemplateMapping>(
    type: K,
    params: TemplateMapping[K]['params']
  ): NotificationBuilder {
    this.template = { ...TEMPLATES[type], params } as TemplateMapping[K];
    return this;
  }

  async send(): Promise<Notification> {
    if (!this.template) {
      throw new Error('Template must be set before sending.');
    }

    const subject = this.applyTemplateParameters(this.template.subject, this.template.params);
    const content = this.applyTemplateParameters(this.template.content, this.template.params);

    return Notification.create({
      userId: payload.userId,
      templateId: payload.templateId,
      subject,
      message,
    });
  }

  private applyTemplateParameters<K extends keyof TemplateMapping>(
    template: string,
    parameters: TemplateMapping[K]['params']
  ): string {
    for (const [key, value] of Object.entries(parameters)) {
      template = template.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    return template;
  }
}
