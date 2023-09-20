export const PageTemplate = (name: string) =>
  `
import { FC } from 'react';

import { Loading } from 'sy-core/components/Elements';
import { Page } from 'sy-core/components/Layout';

export const ${name}: FC = () => {
  return (
    <Page>
      Boilerplate
    </Page>
  );
};
`;

export default PageTemplate;
