/* eslint-disable @typescript-eslint/no-explicit-any */

interface Window {
  __PRELOADED_DATA__: any;
  __PAGE_CONFIGS__: any;
}

interface SyrupConfig {
  customLinkOrder?: string[];
  theme?: {
    primaryColor: string;
    secondaryColor: string;
  };
  routing?: {
    lazyLoad: boolean;
    redirectToHttps: boolean;
  };
  seo?: {
    defaultTitle: string;
    defaultDescription: string;
  };
  errorPages?: {
    custom404: string;
    custom500: string;
  };

  // features?: {
  //   enableComments: boolean;
  //   enableRatings: boolean;
  // };
  // analytics?: {
  //   googleAnalyticsID: string;
  // };
  // localization?: {
  //   defaultLanguage: string;
  //   supportedLanguages: string[];
  // };
  // performance?: {
  //   enablePrefetch: boolean;
  //   enableCompression: boolean;
  // };
}
