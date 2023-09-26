import React, { ReactElement, useEffect, useState } from 'react';
import Route from './components/Route';
import CSRRouter from './CSRRouter';

import { LayoutProvider, LayoutSwapper } from './state/layout';
import { DataProvider } from './state/data/DataProvider';
import { SEOProvider } from './state/seo/SEOProvider';
import LoadingSwapper from './state/loading/LoadingSwapper';

export type RouteConfig = {
  path: string;
  component: string;
  layout?: string;
  load?: string;
  action?: string;
  seo?: string;
  error?: string;
  loading?: string;
  layoutOverride?: string;
  children?: RouteConfig[];
};

type SyrupRouterProps = {
  loadingComponent: ReactElement;
  errorComponent: ReactElement;
  routes: RouteConfig[];
};

const renderRoutes = async (routes: RouteConfig[], parentPath = ''): Promise<ReactElement[]> => {
  return await Promise.all(
    routes.map(async (route) => {
      const isRootPath = route.path === '/';
      const fullPath = isRootPath ? '/' : `${parentPath}/${route.path}`.replace('//', '/');
      let PageComponent;

      try {
        // const importedModule = await import(/* @vite-ignore */ `../../pages/${route.component}`);
        PageComponent = React.lazy(() => import(`../../pages/${route.component}`));
        // PageComponent = importedModule.default;
      } catch (e) {
        console.error(`Failed to load component at ${route.component}:`, e);
        throw e;
      }

      return (
        <React.Fragment key={fullPath}>
          <Route
            path={fullPath}
            component={
              <React.Suspense fallback={<LoadingSwapper currentPath={route.path} />}>
                {route.load ? (
                  <DataProvider loadPath={route.load}>
                    <PageComponent />
                  </DataProvider>
                ) : (
                  <PageComponent />
                )}
              </React.Suspense>
            }
          />

          {route.children && (await renderRoutes(route.children, fullPath))}
        </React.Fragment>
      );
    })
  );
};

const flattenRoutes = (arr: React.ReactNode[]): React.ReactNode[] => {
  return arr.reduce((acc: React.ReactNode[], val: React.ReactNode) => {
    if (Array.isArray(val)) {
      return acc.concat(flattenRoutes(val));
    } else if (React.isValidElement(val) && val.props.children) {
      return acc.concat(flattenRoutes(React.Children.toArray(val.props.children)));
    } else {
      return acc.concat(val);
    }
  }, []);
};

export const SyrupRouter: React.FC<SyrupRouterProps> = ({ loadingComponent, routes }) => {
  const [routeElements, setRouteElements] = useState<ReactElement[] | null>(null);
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    const fetchRoutes = async () => {
      const renderedRoutes = await renderRoutes(routes);
      const flattenedRoutes = flattenRoutes(renderedRoutes);
      setRouteElements(flattenedRoutes as ReactElement[]);
    };

    const updateCurrentPath = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', updateCurrentPath);

    fetchRoutes();

    return () => {
      window.removeEventListener('popstate', updateCurrentPath);
    };
  }, [routes]);

  if (!routeElements) {
    return <>{loadingComponent}</>;
  }

  return (
    <React.Fragment>
      <LayoutProvider>
        <LayoutSwapper currentPath={currentPath} routes={routes}>
          <SEOProvider path={currentPath}>
            <CSRRouter loadingComponent={<div>Loading...</div>}>{routeElements}</CSRRouter>
          </SEOProvider>
        </LayoutSwapper>
      </LayoutProvider>
    </React.Fragment>
  );
};
