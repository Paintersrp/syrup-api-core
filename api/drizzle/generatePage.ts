type PageParams = {
  comp: number;
  css: boolean;
};

export function generatePage(params: PageParams) {
  const { comp, css } = params;

  // Generate components
  const components = Array.from({ length: comp })
    .map((_, index) => `<Component${index + 1} />`)
    .join('\n  ');

  // Include CSS import if required
  const cssImport = css ? "import './MyPage.css';" : '';

  const pageTemplate = `
      import React from 'react';
      ${cssImport}
    
      const MyPage = () => {
        return (
          <div>
            ${components}
          </div>
        );
      };
    
      export default MyPage;
    `;

  // Write this to a file
}
export default generatePage;
