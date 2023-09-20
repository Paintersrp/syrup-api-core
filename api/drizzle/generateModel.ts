import fs from 'fs';
import prettier from 'prettier';

type SimpleModelParams = {
  name: string;
  fields: number;
  seed: boolean;
};

export async function generateModel(params: SimpleModelParams, filePath: string) {
  const { name, fields, seed } = params;

  const fieldDefinitions = Array(fields)
    .fill(0)
    .map((_, i) => generateFieldDefinition(i))
    .join('\n  ');

  const seedDefinitions = Array(fields)
    .fill(0)
    .map((_, i) => generateSeedDefinition(i))
    .join('\n  ');

  const lowercaseName = name.toLowerCase();

  const modelTemplate = `
    import { DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
    import { faker } from '@faker-js/faker';

    import { Field } from '../core/decorators/models';
    import { sequelize } from '../settings';
    import { SyModel } from '../core/SyModel';

    export class ${name} extends SyModel<InferAttributes<${name}>, InferCreationAttributes<${name}>> {
      ${fieldDefinitions}
  
      public async methodName(instance: ${name}) {
        return;
      }

      public static hooks = {
        beforeCreate: async (instance: ${name}) => {},
        afterCreate: async (instance: ${name}) => {},
      };

      ${
        seed
          ? `
      static async seed${name}(count: number) {
        try {
          const ${lowercaseName}Data = []
  
          for (let i = 0; i < count; i++) {
            ${lowercaseName}Data.push({
              ${seedDefinitions}
            })
          }
  
          await ${name}.bulkCreate(${lowercaseName}Data);
          console.log('${name} seeding completed successfully.');
        } catch (error) {
          console.error('${name} seeding failed:', error);
        }
      }
      `
          : ''
      }
    }

    ${name}.init(
      {
        ...SyModel.metaFields,
        ...${name}.fields,
      },
      {
        hooks: ${name}.hooks,
        tableName: '${lowercaseName}',
        sequelize,
      }
    );
  `;

  const formattedModelTemplate = await prettier.format(modelTemplate, {
    semi: true,
    trailingComma: 'all',
    singleQuote: true,
    printWidth: 100,
    tabWidth: 2,
    parser: 'typescript',
  });

  fs.writeFileSync(filePath, formattedModelTemplate);
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

function generateSeedDefinition(index: number): string {
  const name = `field${index}`;
  const fakerFunction = 'faker.random.word()';
  return `${name}: ${fakerFunction},`;
}

export default generateModel;
