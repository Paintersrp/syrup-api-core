import * as t from '@babel/types';
import traverse from '@babel/traverse';
import crypto from 'crypto';

export class ASTProcessor {
  public traverseAndUpdateAST = (ast: any, existingStyles: Record<string, any>) => {
    traverse(ast, {
      JSXElement: (path) => {
        this.handleElement(path.node.openingElement as t.JSXOpeningElement, existingStyles);
        path.traverse({
          JSXElement: (innerPath) => {
            this.handleElement(
              innerPath.node.openingElement as t.JSXOpeningElement,
              existingStyles
            );
          },
        });
      },
    });
  };

  private getInlineStyles = (
    attributes: (t.JSXAttribute | t.JSXSpreadAttribute)[]
  ): [Record<string, string>, Record<string, t.Expression>, boolean] => {
    let hasDynamicStyles = false;
    const inlineStyles: Record<string, string> = {};
    const dynamicStyles: Record<string, t.Expression> = {};

    const inlineStyleAttr = attributes.find(
      (attr) => attr.type === 'JSXAttribute' && attr.name.name === 'style'
    ) as t.JSXAttribute;

    if (
      inlineStyleAttr &&
      inlineStyleAttr.value &&
      inlineStyleAttr.value.type === 'JSXExpressionContainer' &&
      inlineStyleAttr.value.expression.type === 'ObjectExpression'
    ) {
      inlineStyleAttr.value.expression.properties.forEach((prop) => {
        if (t.isObjectProperty(prop)) {
          const key = t.isIdentifier(prop.key)
            ? this.toHyphenCase(prop.key.name)
            : t.isStringLiteral(prop.key)
            ? this.toHyphenCase(prop.key.value)
            : null;

          if (key) {
            if (t.isStringLiteral(prop.value) || t.isNumericLiteral(prop.value)) {
              inlineStyles[key] = prop.value.value.toString();
            } else if (t.isExpression(prop.value)) {
              hasDynamicStyles = true;
              dynamicStyles[key] = prop.value;
            }
          }
        }
      });
    }

    return [inlineStyles, dynamicStyles, hasDynamicStyles];
  };

  private handleElement = (
    node: t.JSXOpeningElement | null,
    existingStyles: Record<string, any>
  ) => {
    if (!node || !node.attributes || node.attributes.length === 0) {
      return;
    }

    const [inlineStyles, dynamicStyles, hasDynamicStyles] = this.getInlineStyles(node.attributes);
    let existingClassName = this.getClassName(node.attributes);

    if (Object.keys(inlineStyles).length > 0) {
      if (existingClassName) {
        existingStyles[`.${existingClassName}`] = {
          ...(existingStyles[`.${existingClassName}`] || {}),
          ...inlineStyles,
        };
      } else {
        const newClassName = this.generateClassName(
          (node.name as t.JSXIdentifier).name,
          inlineStyles
        );
        existingStyles[`.${newClassName}`] = inlineStyles;
        existingClassName = newClassName;
      }

      this.updateAttributes(node, existingClassName, dynamicStyles, hasDynamicStyles);
    }
  };

  private toHyphenCase = (str: string) => {
    return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
  };

  private getClassName = (attributes: any[]): string | null => {
    for (const attr of attributes) {
      if (attr.type === 'JSXAttribute' && attr.name.name === 'className') {
        if (attr.value.type === 'StringLiteral' || attr.value.type === 'Literal') {
          return attr.value.value;
        } else if (attr.value.type === 'JSXExpressionContainer') {
          const expression = attr.value.expression;
          if (expression.type === 'Identifier' || expression.type === 'MemberExpression') {
            return expression.property.name;
          }
        }
      }
    }
    return null;
  };

  private generateClassName = (elementType: string, inlineStyles: Record<string, any>): string => {
    const styleHash = crypto
      .createHash('md5')
      .update(JSON.stringify(inlineStyles))
      .digest('hex')
      .substring(0, 6);

    return `${elementType}_${styleHash}`;
  };

  private updateAttributes = (
    node: t.JSXOpeningElement,
    className: string,
    dynamicStyles: Record<string, t.Expression>,
    keepDynamic: boolean
  ) => {
    node.attributes = this.removeAttributeStyle(node.attributes, keepDynamic, dynamicStyles);
    this.addOrUpdateClassName(node, className);
  };

  private removeAttributeStyle = (
    attributes: any[],
    keepDynamic: boolean,
    dynamicStyles: Record<string, t.Expression>
  ) => {
    if (keepDynamic && Object.keys(dynamicStyles).length > 0) {
      const dynamicStyleProps = Object.entries(dynamicStyles).map(([key, value]) =>
        t.objectProperty(t.stringLiteral(key), value)
      );
      const dynamicStyleObj = t.objectExpression(dynamicStyleProps);

      const dynamicStyleAttr = t.jSXAttribute(
        t.jSXIdentifier('style'),
        t.jSXExpressionContainer(dynamicStyleObj)
      );

      return attributes.map((attr) => {
        if (attr.type === 'JSXAttribute' && attr.name.name === 'style') {
          return dynamicStyleAttr;
        }
        return attr;
      });
    }

    return attributes.filter((attr) => {
      return !(attr.type === 'JSXAttribute' && attr.name.name === 'style');
    });
  };

  private addOrUpdateClassName = (node: t.JSXOpeningElement, className: string) => {
    const existingClassNameAttr = node.attributes.find(
      (attr): attr is t.JSXAttribute =>
        attr.type === 'JSXAttribute' && attr.name.name === 'className'
    );

    if (existingClassNameAttr) {
      existingClassNameAttr.value = t.jsxExpressionContainer(
        t.memberExpression(t.identifier('styles'), t.identifier(className))
      );
    } else {
      const newClassNameAttr = t.jsxAttribute(
        t.jsxIdentifier('className'),
        t.jsxExpressionContainer(
          t.memberExpression(t.identifier('styles'), t.identifier(className))
        )
      );
      node.attributes.push(newClassNameAttr);
    }
  };
}
