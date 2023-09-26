import React, { ReactElement, useEffect, useState } from 'react';
import { importModule } from '../../../utils/importModule.ts';

type LoadingSwapperProps = {
  currentPath: string;
};

export const LoadingSwapper: React.FC<LoadingSwapperProps> = ({ currentPath }) => {
  const [loadingComponent, setLoadingComponent] = useState<ReactElement | null>(null);
  const [rootLoadingComponent, setRootLoadingComponent] = useState<ReactElement | null>(null);

  useEffect(() => {
    const loadRootLayout = async () => {
      try {
        const rootLoadingModule = await import(`../../../../pages/loading.tsx`);
        const RootLoading = rootLoadingModule.default;
        const rootElement = <RootLoading />;
        setRootLoadingComponent(rootElement);
      } catch (e) {
        console.error('Failed to load root layout:', e);
      }
    };

    loadRootLayout();
  }, []);

  useEffect(() => {
    const fetchLoadingComponent = async () => {
      setLoadingComponent(null);

      const pathParts = currentPath === '/' ? [''] : currentPath.split('/').filter(Boolean);
      let accumulatedPath = '';

      for (const part of pathParts) {
        accumulatedPath += part === '' ? '' : `/+${part}`;
      }

      try {
        const component = await importModule(`../../pages${accumulatedPath}/loading.tsx`);
        setLoadingComponent(component.default);
      } catch (e) {
        setLoadingComponent(rootLoadingComponent);
      }
    };

    fetchLoadingComponent();
  }, [currentPath, rootLoadingComponent]);

  return loadingComponent;
};

export default LoadingSwapper;
