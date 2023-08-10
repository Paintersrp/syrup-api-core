export interface SEOInterface {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
  author?: string;
  robots?: string;
}

export interface OpenGraphInterface {
  type?: string;
  site_name?: string;
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  image_alt?: string;
  image_width?: number;
  image_height?: number;
}

export interface TwitterCardInterface {
  card?: string;
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
}

export interface PageConfigInterface {
  path?: string;
  seo?: SEOInterface;
  og?: OpenGraphInterface;
  twitterCard?: TwitterCardInterface;
  fetchData?: Function;
}
