import { Template } from '../../models/general';

/**
 * Service class for handling notification templates.
 */
export class TemplateService {
  /**
   * Creates a new notification template.
   * @param id - The unique identifier for the template.
   * @param name - The name of the template.
   * @param subject - The subject line for the template.
   * @param content - The content of the template with placeholders.
   * @param description - Optional description or usage instruction for the template.
   * @returns The created template.
   */
  static async createTemplate(
    id: string,
    name: string,
    subject: string,
    content: string,
    description: string
  ): Promise<Template> {
    return Template.create({ id, name, subject, content, description });
  }

  /**
   * Updates an existing notification template.
   * @param id - The unique identifier for the template.
   * @param name - Optional new name for the template.
   * @param subject - Optional new subject line for the template.
   * @param content - Optional new content for the template.
   * @param description - Optional new description or usage instruction for the template.
   * @returns The updated template if successful, or null if the template was not found.
   */
  static async updateTemplate(
    id: string,
    name?: string,
    subject?: string,
    content?: string,
    description?: string
  ): Promise<Template | null> {
    const updateData: Partial<Template> = { name, subject, content, description };

    Object.keys(updateData).forEach((key) => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    const [updateCount, [updatedTemplate]] = await Template.update(updateData, {
      where: { id },
      returning: true,
    });
    if (updateCount > 0) {
      return updatedTemplate;
    }
    return null;
  }

  /**
   * Retrieves a notification template by its unique identifier.
   * @param id - The unique identifier for the template.
   * @returns The retrieved template if found, or null if not found.
   */
  static async getTemplate(id: string): Promise<Template | null> {
    return Template.findByPk(id);
  }

  /**
   * Deletes a notification template by its unique identifier.
   * @param id - The unique identifier for the template.
   */
  static async deleteTemplate(id: string): Promise<void> {
    await Template.destroy({ where: { id } });
  }
}
