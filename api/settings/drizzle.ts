import { WatcherConfig } from '../core/server/managers/drizzle/types';
import { paths } from '../paths';
import { generateModel } from '../drizzle/generateModel';
import { generatePage } from '../drizzle/generatePage';
import generateFields from '../drizzle/generateModelPour';

export default {
  watchers: [
    {
      path: paths.web.test.src.pages,
      type: 'newDir',
    },
    {
      path: paths.api.models,
      type: 'newDir',
      pragma: {
        drizzle: {
          model: generateModel,
          page: generatePage,
        },
        pour: {
          fields: generateFields,
        },
      },
    },
  ],
} as WatcherConfig;
