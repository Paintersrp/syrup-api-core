/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';

const AppRoutes = () => {
  console.log(window.__PAGE_CONFIGS__);
  const [dynamicRoutes, setDynamicRoutes] = useState<any | null>(null);

  useEffect(() => {
    const loadRoutes = async () => {
      const pageConfigs = window.__PAGE_CONFIGS__;
      const routes = await Promise.all(
        pageConfigs.map(async (config: any) => {
          const PageComponent = (await import(`../pages/${config.pageName}/page.tsx`)).default;
          console.log(PageComponent);
          return {
            path: config.path,
            element: <PageComponent />,
          };
        })
      );
      setDynamicRoutes(routes);
    };

    loadRoutes();
  }, []);

  const routes = useRoutes(dynamicRoutes);

  return routes;
};

export default AppRoutes;
