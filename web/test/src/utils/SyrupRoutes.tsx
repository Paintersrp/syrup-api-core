import { lazy, Suspense, FC, ReactElement, useEffect } from 'react';
import { useRoutes, Outlet, useLocation } from 'react-router-dom';

import routesConfig from '../routesConfig.json';
import { GeneratedRoute, RouteConfig } from './types';
import { Page } from '../components/Page/Page';

const createRoutes = (routes: RouteConfig[], basePath = '', isNested = false): GeneratedRoute[] => {
  return routes.map((route): GeneratedRoute => {
    const fullPath = `${basePath}/${route.path}`.replace(/\/\//g, '/');

    const folderPath = isNested
      ? `${basePath}/pages/${route.path}`
          .replace(/\/\//g, '/')
          .replace(/:\w+/g, (match) => `[${match.slice(1)}]`)
      : fullPath.replace(/:\w+/g, (match) => `[${match.slice(1)}]`);

    const LazyComponent = route.hasIndex
      ? lazy(async () => {
          const dynamicPath = `../pages${folderPath}/index`;
          return import(/* @vite-ignore */ `${dynamicPath}.tsx`).catch(
            () => import(/* @vite-ignore */ `${dynamicPath}.ts`)
          );
        })
      : null;

    const element: ReactElement = LazyComponent ? (
      <Suspense fallback={<Page>Loading...</Page>}>
        <LazyComponent />
      </Suspense>
    ) : (
      <Outlet />
    );

    const children: GeneratedRoute[] = route.nestedRoutes
      ? createRoutes(route.nestedRoutes, folderPath, true)
      : [];

    if (LazyComponent) {
      children.unshift({ path: '', element: element });
    }

    return {
      path: route.path,
      element: <Outlet />,
      children,
    };
  });
};

const SyrupRoutes: FC = () => {
  const element = useRoutes(createRoutes(routesConfig));
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return <>{element}</>;
};

export default SyrupRoutes;
