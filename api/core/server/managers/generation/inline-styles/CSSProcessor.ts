import prettier from 'prettier';
import * as fs from 'fs';
import * as path from 'path';
import { parse as parseCSS, Rule } from 'css';

export class CSSProcessor {
  public updateCSSModule = async (filePath: string, existingStyles: Record<string, any>) => {
    const cssModulePath = path.join(
      path.dirname(filePath),
      `${path.basename(filePath, '.tsx')}.module.css`
    );

    const formattedCssContent = await this.formatCSSContent(existingStyles);
    fs.writeFileSync(cssModulePath, formattedCssContent);
  };

  private formatCSSContent = async (existingStyles: Record<string, any>) => {
    const cssContent = Object.entries(existingStyles)
      .map(([selector, styles]) => {
        const properties = Object.entries(styles)
          .map(([property, value]) => `${property}: ${value};`)
          .join(' ');

        return `${selector} { ${properties} }`;
      })
      .join('\n\n');

    return await prettier.format(cssContent, {
      parser: 'css',
      singleQuote: true,
    });
  };

  public readCSSModuleForFile = (filePath: string) => {
    const cssModulePath = path.join(
      path.dirname(filePath),
      `${path.basename(filePath, '.tsx')}.module.css`
    );
    return this.readCSSModule(cssModulePath);
  };

  private readCSSModule = (cssModulePath: string) => {
    let existingStyles: Record<string, any> = {};

    try {
      if (fs.existsSync(cssModulePath)) {
        const cssContent = fs.readFileSync(cssModulePath, 'utf-8');
        const parsedCSS = parseCSS(cssContent);

        for (const rule of parsedCSS.stylesheet!.rules) {
          if (rule.type === 'rule') {
            const ruleAsRuleType = rule as Rule;
            if (ruleAsRuleType.selectors && ruleAsRuleType.declarations) {
              for (const selector of ruleAsRuleType.selectors) {
                existingStyles[selector] = ruleAsRuleType.declarations.reduce(
                  (acc: any, decl: any) => {
                    acc[decl.property] = decl.value;
                    return acc;
                  },
                  {}
                );
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error reading or parsing CSS module:', error);
    }

    return existingStyles;
  };
}
