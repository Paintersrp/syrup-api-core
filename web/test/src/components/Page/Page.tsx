import React from 'react';
import styles from './Page.module.css';
import { SEO, SEOData } from '../SEO/SEO';

interface PageProps {
  seoData?: SEOData;
  children: React.ReactNode;
}

export const Page: React.FC<PageProps> = ({ seoData, children }) => {
  return (
    <div className={styles.page}>
      <SEO {...seoData} />
      {children}
    </div>
  );
};
