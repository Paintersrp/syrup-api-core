import fs from 'fs';
import prettier from 'prettier';

type SimpleModelParams = {
  fields: number;
};
export async function generateFields(
  params: SimpleModelParams,
  filePath: string,
  lineIndex: number
) {
  const { fields } = params;

  const fieldDefinitions = Array(fields)
    .fill(0)
    .map((_, i) => generateFieldDefinition(i))
    .join('\n  ');

  const newContent = `
  ${fieldDefinitions}
  `;

  const existingContent = fs.readFileSync(filePath, 'utf8').split('\n');

  existingContent[lineIndex] = newContent;

  const updatedContent = existingContent.join('\n');
  console.log(updatedContent);

  try {
    const formattedContent = await prettier.format(updatedContent, {
      semi: true,
      trailingComma: 'all',
      singleQuote: true,
      printWidth: 100,
      tabWidth: 2,
      parser: 'typescript',
    });

    fs.writeFileSync(filePath, formattedContent);
  } catch (error) {
    console.error(error);
  } finally {
    fs.writeFileSync(filePath, updatedContent);
  }
}

function generateFieldDefinition(index: number): string {
  const name = `field${index}`;
  const type = 'STRING';
  return `
  @Field({
    type: DataTypes.${type},
  })
  public ${name}: ${type.toLowerCase()};
  `;
}

export default generateFields;
