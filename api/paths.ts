import path from 'path';
import { BasePathStructure } from './core/utils/PathResolver/types';
import { PathResolver } from './core/utils/PathResolver/PathResolver';

interface PathStructure extends BasePathStructure {
  api: {
    models: string | null;
    routes: string | null;
    controllers: string | null;
    schemas: string | null;
    'server.ts': string | null;
  };
  web: {
    test: {
      src: {
        components: string | null;
        pages: string | null;
        'App.tsx': string | null;
        'main.tsx': string | null;
      };
    };
  };
}

const structure: PathStructure = {
  api: {
    models: null,
    routes: null,
    controllers: null,
    schemas: null,
    'server.ts': null,
  },
  web: {
    test: {
      src: {
        components: null,
        pages: null,
        'App.tsx': null,
        'main.tsx': null,
      },
    },
  },
};

const resolver = new PathResolver<PathStructure>(path.join(__dirname, '../'), structure);
export const paths = resolver.paths;
