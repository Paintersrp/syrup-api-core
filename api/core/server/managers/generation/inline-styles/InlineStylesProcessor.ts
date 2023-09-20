import * as fs from 'fs';
import * as path from 'path';
import * as parser from '@babel/parser';

import generate from '@babel/generator';
import prettier from 'prettier';

import { ASTProcessor } from './ASTProcessor';
import { CSSProcessor } from './CSSProcessor';

export class InlineStylesProcessor {
  private cssProcessor: CSSProcessor;
  private astProcessor: ASTProcessor;

  constructor() {
    this.cssProcessor = new CSSProcessor();
    this.astProcessor = new ASTProcessor();
  }

  public processFile = async (filePath: string) => {
    if (!this.isSyrupFlagged(filePath)) return;

    const ast = this.parseFile(filePath);
    const existingStyles = this.cssProcessor.readCSSModuleForFile(filePath);

    this.astProcessor.traverseAndUpdateAST(ast, existingStyles);

    await this.cssProcessor.updateCSSModule(filePath, existingStyles);

    const newCode = await this.updateAndFormatTSX(ast, filePath);

    this.writeUpdatedTSX(filePath, newCode);
  };

  private isSyrupFlagged = (filePath: string): boolean => {
    const code = fs.readFileSync(filePath, 'utf-8');
    return code.includes('// @syrup.css');
  };

  private parseFile = (filePath: string) => {
    const code = fs.readFileSync(filePath, 'utf-8');
    return parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });
  };

  private updateAndFormatTSX = async (ast: any, filePath: string): Promise<string> => {
    const generatedCodeFromAst = generate(ast).code;
    // let newCode = generatedCodeFromAst.replace('// @syrup.css', '');
    let newCode = generatedCodeFromAst;

    const importStatement = this.buildImportStatement(filePath);
    newCode = this.insertImportStatement(newCode, importStatement);

    const withExportNewline = newCode.replace('export default', '\nexport default');
    const finalCode = await this.formatTSXCode(withExportNewline);

    return finalCode;
  };

  private buildImportStatement = (filePath: string) => {
    return `import styles from "./${path.basename(filePath, '.tsx')}.module.css";`;
  };

  private insertImportStatement = (code: string, importStatement: string) => {
    const lines = code.split('\n');
    const importLines = lines.filter((line) => line.startsWith('import '));
    const importStylesExists = importLines.some((line) => line.startsWith('import styles from'));

    if (!importStylesExists) {
      importLines.push(importStatement);
    }

    importLines.sort();

    const nonImportLines = lines.filter((line) => !line.startsWith('import '));
    return [...importLines, '', ...nonImportLines].join('\n');
  };

  private formatTSXCode = async (code: string) => {
    return await prettier.format(code, { parser: 'typescript' });
  };

  private writeUpdatedTSX = (filePath: string, newCode: string) => {
    fs.writeFileSync(filePath, newCode);
  };
}
