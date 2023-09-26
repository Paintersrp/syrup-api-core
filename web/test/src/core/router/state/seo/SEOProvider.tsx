/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect, useState } from 'react';
import { SEO } from '../../../../components/SEO/SEO';

type SEOProviderProps = {
  path: string;
  children: React.ReactNode;
};

async function importModule(path: string) {
  try {
    return await import(/* @vite-ignore */ `${path}`);
  } catch (error) {
    console.error('Failed to import module:', error);
    throw error;
  }
}
export const SEOProvider: React.FC<SEOProviderProps> = ({ path, children }) => {
  const [seoData, setSeoData] = useState<any | null>(null);
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    console.log('Path changed:', path); // For debugging

    const fetchSeoData = async () => {
      console.log('fetching seo');
      const pathParts = path === '/' ? [''] : path.split('/').filter(Boolean);
      let accumulatedPath = '';

      for (const part of pathParts) {
        accumulatedPath += part === '' ? '' : `/+${part}`;
      }

      try {
        const module = await importModule(`../../../../pages${accumulatedPath}/api/seo.ts`);
        const data = await module.default;
        console.log('Fetched new SEO data:', data); // For debugging

        setSeoData(data);
        setKey(Date.now().toString());
      } catch (e) {
        console.error(`Failed to load SEO data for ${path}:`, e);
      }
    };

    fetchSeoData();
  }, [path]);

  return (
    <Fragment>
      {seoData ? (
        <>
          <SEO key={key} {...seoData} />
          {children}
        </>
      ) : null}
    </Fragment>
  );
};
