/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from './LayoutProvider.tsx';
import { RouteConfig } from '../../SyrupRouter.tsx';

interface LayoutSwapperProps {
  children: React.ReactNode;
  currentPath: string;
  routes: RouteConfig[];
}

const hasLayout = (path: string, routeTree: RouteConfig[]): boolean => {
  for (const route of routeTree) {
    if (route.path === path) {
      return !!route.layout;
    }
    if (route.children) {
      const result = hasLayout(path, route.children);
      if (result) return true;
    }
  }
  return false;
};

export const LayoutSwapper: React.FC<LayoutSwapperProps> = ({ children, currentPath, routes }) => {
  const { layouts, setLayouts } = useContext(LayoutContext);
  const [rootLayout, setRootLayout] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    const loadRootLayout = async () => {
      try {
        const RootLayout = React.lazy(() => import(`../../../../pages/layout.tsx`));
        const rootElement = <RootLayout />;

        // const rootModule = await import(`../../../../pages/layout.tsx`);
        // const RootLayout = rootModule.default;
        // const rootElement = <RootLayout />;

        setRootLayout(rootElement);
        setLayouts((prevLayouts) => ({
          ...prevLayouts,
          '/layout.tsx': rootElement,
        }));
      } catch (e) {
        console.error('Failed to load root layout:', e);
      }
    };

    loadRootLayout();
  }, []);

  useEffect(() => {
    const loadLayouts = async () => {
      if (rootLayout === null) return;

      const pathParts = currentPath === '/' ? [''] : currentPath.split('/').filter(Boolean);
      let accumulatedPath = '';

      const activeLayouts: { [key: string]: React.ReactNode } = {
        '/layout.tsx': rootLayout,
      };

      for (const part of pathParts) {
        console.log(part);
        accumulatedPath += part === '' ? '' : `/+${part}`;

        const layoutKey = `${accumulatedPath}/layout.tsx`;

        if (hasLayout(part, routes)) {
          if (!layouts[layoutKey]) {
            try {
              const LayoutComponent = React.lazy(() => import(`../../../../pages${layoutKey}`));
              activeLayouts[layoutKey] = <LayoutComponent />;

              // const module = await import(`../../../../pages${layoutKey}`);
              // const LayoutComponent = module.default;
              // activeLayouts[layoutKey] = <LayoutComponent />;
            } catch (err) {
              console.error(`Failed to load layout for ${accumulatedPath}`);
            }
          } else {
            activeLayouts[layoutKey] = layouts[layoutKey];
          }
        }
      }

      const newLayouts = { ...layouts, ...activeLayouts };
      Object.keys(layouts).forEach((key) => {
        if (!activeLayouts[key]) {
          delete newLayouts[key];
        }
      });

      setLayouts(newLayouts);
    };

    loadLayouts();
  }, [currentPath, rootLayout]);

  return (
    <React.Fragment>
      {Object.entries(layouts).map(([key, Layout]) => (
        <React.Fragment key={key}>
          {React.cloneElement(Layout as React.ReactElement)}
        </React.Fragment>
      ))}
      {children}
    </React.Fragment>
  );
};

export default LayoutSwapper;
