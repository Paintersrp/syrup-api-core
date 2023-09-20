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

function generateRoutes() {
  const routesConfig = generateRouteEntry(path.resolve(__dirname, 'src/pages'));
  const outputJSON = JSON.stringify(routesConfig, null, 2);
  fs.writeFileSync(path.resolve(__dirname, 'src/routesConfig.json'), outputJSON);
}

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

      const hasIndex = fs.existsSync(path.join(fullPath, 'index.tsx'));

      const resolvedPath =
        dir.name.startsWith('[') && dir.name.endsWith(']') ? `:${dir.name.slice(1, -1)}` : dir.name;

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
