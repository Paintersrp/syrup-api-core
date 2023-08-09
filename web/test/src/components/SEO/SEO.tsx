import React from 'react';
import { Helmet } from 'react-helmet-async';

export type SEOData = {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
};

export const SEO: React.FC<SEOData> = (seoData) => {
  return (
    <Helmet>
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords} />
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:image" content={seoData.image} />
      <meta property="og:url" content={seoData.url} />
      <meta property="og:type" content="website" />
      <meta property="og:image:alt" content={seoData.description} />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      <meta name="twitter:image" content={seoData.image} />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={seoData.url} />
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
};
