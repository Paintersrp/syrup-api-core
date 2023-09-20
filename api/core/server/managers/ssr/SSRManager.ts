import path from 'path';
import fs from 'fs-extra';
import Koa from 'koa';
import Router from 'koa-router';
import serve from 'koa-static';

/**
 * Class responsible for setting up Server-Side Rendering (SSR) in a Koa application.
 */
export class SSRManager {
  /**
   * Constructor for the SSRManager class.
   * Initializes SSR for the given Koa application and router.
   * @param {Koa} app - The Koa application instance.
   * @param {Router} router - The Koa router instance.
   * @param {string} [distPath] - Optional distribution path where the SSR files are located.
   */
  constructor(app: Koa, router: Router, distPath?: string) {
    this.initializeSSR(app, router, distPath);
  }

  /**
   * Sets up SSR if a distribution path is provided.
   * Serves static files from the distribution path and sets up a catch-all route
   * to handle all requests by rendering the index.html file.
   * @param {Koa} app - The Koa application instance.
   * @param {Router} router - The Koa router instance.
   * @param {string} [distPath] - Optional distribution path where the SSR files are located.
   * @public
   */
  public initializeSSR(app: Koa, router: Router, distPath?: string) {
    if (distPath) {
      app.use(serve(distPath));

      router.get('*', async (ctx) => {
        ctx.type = 'html';
        ctx.body = fs.createReadStream(path.join(distPath, 'index.html'));
      });

      app.use(router.routes()).use(router.allowedMethods());
    }
  }
}

// const router = new Router();

// // Dynamic config reading
// const dynamicImport = async (filePath: string) => {
//   return import(filePath);
// };

// const generatePageConfigs = async () => {
//   const pagesDir = paths.web.test.src.pages;

//   if (!pagesDir) {
//     return;
//   }

//   const directories = fs
//     .readdirSync(pagesDir)
//     .filter((dir) => fs.statSync(path.join(pagesDir, dir)).isDirectory());

//   const pageConfigs = [];

//   for (const dir of directories) {
//     const configFilePath = path.join(pagesDir, dir, 'config.ts');

//     if (fs.existsSync(configFilePath)) {
//       const configFile = await dynamicImport(configFilePath);
//       const config = configFile.default;

//       if (!config) {
//         settings.APP_LOGGER.warn(`No default export found in ${configFilePath}`);
//         continue;
//       }

//       if (!config.path) {
//         settings.APP_LOGGER.warn(`Missing path in ${configFilePath}`);
//         continue;
//       }

//       if (!config.fetchData) {
//         settings.APP_LOGGER.warn(`Missing fetchData in ${configFilePath}`);
//         continue;
//       }

//       if (!config.seo) {
//         settings.APP_LOGGER.warn(`Missing SEO data in ${configFilePath}`);
//       }

//       pageConfigs.push({
//         path: config.path,
//         seoData: config.seo,
//         fetchData: config.fetchData,
//         pageName: dir,
//       });
//     }
//   }

//   return pageConfigs;
// };

// const matchRoute = (path: string, pattern: string): Record<string, string> | null => {
//   const pathSegments = path.split('/').filter(Boolean);
//   const patternSegments = pattern.split('/').filter(Boolean);

//   if (pathSegments.length !== patternSegments.length) {
//     return null;
//   }

//   const params: Record<string, string> = {};

//   for (let i = 0; i < patternSegments.length; i++) {
//     const isDynamic = patternSegments[i].startsWith(':');
//     if (isDynamic) {
//       const paramName = patternSegments[i].substring(1);
//       params[paramName] = pathSegments[i];
//     } else if (patternSegments[i] !== pathSegments[i]) {
//       return null;
//     }
//   }

//   return params;
// };

// // better vite integration / ssr integration
// // encapsulate in syserver, ssr client
// // add configuration options
// router.get('*', async (ctx) => {
//   const pageConfigs = await generatePageConfigs();

//   if (!pageConfigs) {
//     return;
//   }

//   let initialData = null;
//   let matchedPage = null;
//   let params = {};

//   for (const config of pageConfigs) {
//     const match = matchRoute(ctx.path, config.path);
//     if (match !== null) {
//       matchedPage = config;
//       params = match;
//       break;
//     }
//   }

//   if (matchedPage && matchedPage.fetchData) {
//     initialData = await matchedPage.fetchData(params);
//   }

//   const htmlContent = fs.readFileSync(
//     path.resolve(__dirname, '../web/test/dist/index.html'),
//     'utf-8'
//   );

//   const withPreloadedData = htmlContent.replace(
//     '<script',
//     `
//     <script nonce="${ctx.state.cspNonce}">
//       window.__PAGE_CONFIGS__ = ${JSON.stringify(pageConfigs)};
//       window.__PRELOADED_DATA__ = ${JSON.stringify(initialData)};
//     </script>
//     <script`
//   );

//   // const withPreloadedData = htmlContent.replace(
//   //   '<script',
//   //   `<script nonce="${ctx.state.cspNonce}">window.__PRELOADED_DATA__ = ${JSON.stringify(
//   //     initialData
//   //   )};</script><script`
//   // );

//   ctx.type = 'text/html';
//   ctx.body = withPreloadedData;
// });

// koa.use(router.routes());
// koa.use(router.allowedMethods());
