/* eslint-disable @typescript-eslint/no-explicit-any */
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });

import { defineConfig, Logger, Plugin, ViteDevServer } from 'vite';
import fs from 'fs';
import path from 'path';
import react from '@vitejs/plugin-react';

let viteLogger: Logger;

const dynamicRoutesPlugin: Plugin = {
  name: 'dynamic-routes',
  configureServer(server: ViteDevServer) {
    viteLogger = server.config.logger;
  },
  handleHotUpdate(ctx) {
    const { file } = ctx;
    const normalizedFile = path.normalize(file);
    const normalizedDir = path.normalize(path.join(__dirname, 'src/pages'));

    if (normalizedFile.startsWith(normalizedDir)) {
      viteLogger?.info(
        '\x1b[32m[Dynamic Routes]\x1b[0m Regenerating routes due to file change...',
        { timestamp: true }
      );
      generateRoutes();
    }
  },
  config() {
    generateRoutes();
    if (viteLogger) {
      viteLogger.info('\x1b[32m[Dynamic Routes]\x1b[0m Initial route generation complete.', {
        timestamp: true,
      });
    }
  },
};

interface RouteEntry {
  path: string;
  hasIndex: boolean;
  nestedRoutes: RouteEntry[] | null;
}

const generateRouteEntry = (folderPath: string, pathPrefix = ''): RouteEntry[] => {
  const dirs = fs.readdirSync(folderPath, { withFileTypes: true });
  const routes: RouteEntry[] = [];

  for (const dir of dirs) {
    const fullPath = path.join(folderPath, dir.name);
    const pathName = dir.name;

    if (dir.isDirectory()) {
      let nestedRoutes: RouteEntry[] = [];

      const newPathPrefix = path.join(pathPrefix, pathName);

      if (fs.existsSync(path.join(fullPath, 'pages'))) {
        nestedRoutes = generateRouteEntry(path.join(fullPath, 'pages'), newPathPrefix);
      } else {
        nestedRoutes = generateRouteEntry(fullPath, newPathPrefix);
      }

      const hasIndex =
        fs.existsSync(path.join(fullPath, 'index.tsx')) ||
        fs.existsSync(path.join(fullPath, 'page.tsx'));

      const parsedDirName = dir.name.startsWith('+') ? dir.name.slice(1) : dir.name;

      const resolvedPath =
        parsedDirName.startsWith('[') && parsedDirName.endsWith(']')
          ? `:${parsedDirName.slice(1, -1)}`
          : parsedDirName;

      if (hasIndex || nestedRoutes.length > 0) {
        routes.push({
          path: resolvedPath,
          hasIndex,
          nestedRoutes: nestedRoutes.length > 0 ? nestedRoutes : null,
        });
      }
    }
  }

  return routes;
};

function generateRoutes() {
  const routesConfig = generateRouteEntry(path.resolve(__dirname, 'src/pages'));
  const outputJSON = JSON.stringify(routesConfig, null, 2);
  fs.writeFileSync(path.resolve(__dirname, 'src/routesConfig.json'), outputJSON);

  const basePath = path.resolve(__dirname, 'src/pages');
  const rootFiles = getRootLevelFiles(basePath);
  const routesConfig2 = generateRouteConfig(basePath);
  rootFiles.children = routesConfig2;

  const outputTS: string[] = ['export default ['];
  writeRoute(outputTS, rootFiles, basePath);
  outputTS.push('];');

  fs.writeFileSync(path.resolve(__dirname, 'src/routesConfig.ts'), outputTS.join('\n'));
}

function writeRoute(
  outputTS: string[],
  route: RouteConfig,
  basePath: string,
  indentation: string = '  '
) {
  outputTS.push(`${indentation}{`);
  outputTS.push(`${indentation}  path: '${route.path}',`);

  if (route.component) {
    const relativePath = path.relative(basePath, route.component).replace(/\\/g, '/');
    outputTS.push(`${indentation}  component: '${relativePath}',`);
  }

  if (route.layout) {
    const relativePath = path.relative(basePath, route.layout).replace(/\\/g, '/');
    outputTS.push(`${indentation}  layout: '${relativePath}',`);
  }

  if (route.load) {
    const relativePath = path.relative(basePath, route.load).replace(/\\/g, '/');
    outputTS.push(`${indentation}  load: '${relativePath}',`);
  }

  if (route.action) {
    const relativePath = path.relative(basePath, route.action).replace(/\\/g, '/');
    outputTS.push(`${indentation}  action: '${relativePath}',`);
  }

  if (route.seo) {
    const relativePath = path.relative(basePath, route.seo).replace(/\\/g, '/');
    outputTS.push(`${indentation}  seo: '${relativePath}',`);
  }

  if (route.error) {
    const relativePath = path.relative(basePath, route.error).replace(/\\/g, '/');
    outputTS.push(`${indentation}  error: '${relativePath}',`);
  }

  if (route.loading) {
    const relativePath = path.relative(basePath, route.loading).replace(/\\/g, '/');
    outputTS.push(`${indentation}  loading: '${relativePath}',`);
  }

  if (route.layoutOverride) {
    const relativePath = path.relative(basePath, route.layoutOverride).replace(/\\/g, '/');
    outputTS.push(`${indentation}  layoutOverride: '${relativePath}',`);
  }

  if (route.children) {
    outputTS.push(`${indentation}  children: [`);
    for (const child of route.children) {
      writeRoute(outputTS, child, basePath, `${indentation}    `);
    }
    outputTS.push(`${indentation}  ],`);
  }

  outputTS.push(`${indentation}},`);
}

function getRootLevelFiles(folderPath: string): RouteConfig {
  const rootRoute: RouteConfig = { path: '/', component: '' };
  const specialFiles = ['page.tsx', 'layout.tsx', 'error.tsx', 'loading.tsx'];

  for (const file of specialFiles) {
    const fullPath = path.join(folderPath, file);
    if (fs.existsSync(fullPath)) {
      const name = file.replace(/\.tsx|.ts$/, '');
      if (name === 'page') rootRoute.component = fullPath;
      else if (name === 'layout') rootRoute.layout = fullPath;
      else if (name === 'api') rootRoute.load = fullPath;
      else if (name === 'error') rootRoute.error = fullPath;
      else if (name === 'loading') rootRoute.loading = fullPath;
    }
  }

  if (fs.existsSync(path.join(folderPath, 'api'))) {
    const apiPath = path.join(folderPath, 'api');
    const apiFiles = fs.readdirSync(apiPath);

    for (const file of apiFiles) {
      const functionName = file.replace(/\.ts$/, '');
      if (functionName === 'load') rootRoute.load = path.join(apiPath, file);
      if (functionName === 'action') rootRoute.action = path.join(apiPath, file);
      if (functionName === 'seo') rootRoute.seo = path.join(apiPath, file);
    }
  }

  return rootRoute;
}

type RouteConfig = {
  path: string;
  component: string;
  layout?: string;
  load?: string;
  action?: string;
  seo?: string;
  guards?: string;
  error?: string;
  loading?: string;
  children?: RouteConfig[];
  layoutOverride?: string;
};

const generateRouteConfig = (folderPath: string, pathPrefix = ''): RouteConfig[] => {
  const dirs = fs.readdirSync(folderPath, { withFileTypes: true });
  const routes: RouteConfig[] = [];

  for (const dir of dirs) {
    const fullPath = path.join(folderPath, dir.name);
    const pathName = dir.name;

    if (dir.isDirectory()) {
      let nestedRoutes: RouteConfig[] = [];
      const newPathPrefix = path.join(pathPrefix, pathName);

      if (fs.existsSync(path.join(fullPath, 'pages'))) {
        nestedRoutes = generateRouteConfig(path.join(fullPath, 'pages'), newPathPrefix);
      } else {
        nestedRoutes = generateRouteConfig(fullPath, newPathPrefix);
      }

      const parsedDirName = dir.name.startsWith('+') ? dir.name.slice(1) : dir.name;

      const resolvedPath =
        parsedDirName.startsWith('[') && parsedDirName.endsWith(']')
          ? `:${parsedDirName.slice(1, -1)}`
          : parsedDirName;

      const hasPage = fs.existsSync(path.join(fullPath, 'page.tsx'));
      const hasLayout = fs.existsSync(path.join(fullPath, 'layout.tsx'));
      const hasOverideLayout = fs.existsSync(path.join(fullPath, '!layout.tsx'));
      // const hasLoad = fs.existsSync(path.join(fullPath, 'api.ts'));
      const hasErrorComponent = fs.existsSync(path.join(fullPath, 'error.tsx'));
      const hasLoadingComponent = fs.existsSync(path.join(fullPath, 'loading.tsx'));

      const newRoute: RouteConfig = {
        path: resolvedPath,
        component: `${fullPath}/page.tsx`,
        layout: hasLayout ? `${fullPath}/layout.tsx` : undefined,
        error: hasErrorComponent ? `${fullPath}/error.tsx` : undefined,
        loading: hasLoadingComponent ? `${fullPath}/loading.tsx` : undefined,
        children: nestedRoutes.length > 0 ? nestedRoutes : undefined,
        layoutOverride: hasOverideLayout ? `${fullPath}/!layout.tsx` : undefined,
      };

      if (fs.existsSync(path.join(fullPath, 'api'))) {
        const apiPath = path.join(fullPath, 'api');
        const apiFiles = fs.readdirSync(apiPath);

        console.log(apiFiles);

        for (const file of apiFiles) {
          const functionName = file.replace(/\.ts$/, '');
          console.log(functionName);
          if (functionName === 'load') newRoute.load = path.join(apiPath, file);
          if (functionName === 'action') newRoute.action = path.join(apiPath, file);
          if (functionName === 'seo') newRoute.seo = path.join(apiPath, file);
        }
      }

      if (hasPage || nestedRoutes.length > 0) {
        routes.push(newRoute);
      }
    }
  }

  return routes;
};

export default defineConfig({
  plugins: [react(), dynamicRoutesPlugin],
  optimizeDeps: {
    include: ['react', 'react-dom'],
    entries: ['index.html', 'src/main.tsx'],
  },
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
