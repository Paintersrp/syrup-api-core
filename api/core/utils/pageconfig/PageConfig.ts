interface SEOInterface {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
}

interface PageConfigInterface {
  path?: string;
  seo?: SEOInterface;
  fetchData?: Function;
}

export class PageConfig {
  private _config: PageConfigInterface = {};

  setPath(path: string): PageConfig {
    this._config.path = path;
    return this;
  }

  setSEO(seoData: SEOInterface): PageConfig {
    this._config.seo = {
      ...this._config.seo,
      ...seoData,
    };
    return this;
  }

  setFetchData(fetchData: Function): PageConfig {
    this._config.fetchData = fetchData;
    return this;
  }

  finalize(): Readonly<PageConfigInterface> {
    return Object.freeze({ ...this._config });
  }
}
