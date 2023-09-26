import { createContext, useEffect, useState } from 'react';
import { DataProviderInterface, DataState } from './types';

export const DataContext = createContext<DataState | null>(null);

export const DataProvider: React.FC<DataProviderInterface> = ({ children, loadPath }) => {
  const [data, setData] = useState<unknown | null>(null);
  const [error, setError] = useState<unknown | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [promise, setPromise] = useState<Promise<unknown> | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setData(null);
    setPromise(null);
    setError(null);

    const loadData = async () => {
      const module = await import(/* @vite-ignore */ `../../../../pages/${loadPath}`);
      const dataFetchPromise = module.default();

      setPromise(dataFetchPromise);

      try {
        const pageData = await dataFetchPromise;

        setData(pageData);
        setIsLoading(false);
      } catch (e: unknown) {
        setError(e);
        setIsLoading(false);
      }
    };

    loadData();
  }, [loadPath]);

  if (isLoading && promise) {
    throw promise;
  }

  const state: DataState = {
    data,
    setData,
    isLoading,
    error,
  };

  return <DataContext.Provider value={state}>{children}</DataContext.Provider>;
};
