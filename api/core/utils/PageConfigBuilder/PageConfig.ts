import {
  OpenGraphInterface,
  PageConfigInterface,
  SEOInterface,
  TwitterCardInterface,
} from './types';

/**
 * PageConfig class to configure SEO, Open Graph, and Twitter Card for a specific page.
 * This class provides methods to define various properties for a page, including path, SEO data,
 * Open Graph data, Twitter Card data, and a fetchData function.
 */
export class PageConfig {
  private _config: PageConfigInterface = {};

  /**
   * Sets the path for the page.
   * @param path - The path string.
   * @throws {Error} Throws an error if the path is not a valid string.
   * @returns The current PageConfig instance.
   */
  setPath(path: string): PageConfig {
    if (!path) throw new Error('Path must be a valid string.');
    this._config.path = path;
    return this;
  }

  /**
   * Sets the SEO data for the page.
   * @param seoData - SEO data including title, description, keywords, etc.
   * @returns The current PageConfig instance.
   */
  setSEO(seoData: SEOInterface): PageConfig {
    this._config.seo = seoData;
    return this;
  }

  /**
   * Sets the Open Graph data for the page.
   * @param ogData - Open Graph data.
   * @returns The current PageConfig instance.
   */
  setOpenGraph(ogData: OpenGraphInterface): PageConfig {
    this._config.og = ogData;
    return this;
  }

  /**
   * Sets the Twitter Card data for the page.
   * @param twitterCardData - Twitter Card data.
   * @returns The current PageConfig instance.
   */
  setTwitterCard(twitterCardData: TwitterCardInterface): PageConfig {
    this._config.twitterCard = twitterCardData;
    return this;
  }

  /**
   * Sets the fetchData function for the page, which can be used to fetch data for Server-Side Rendering (SSR).
   * @param fetchData - A function to fetch data.
   * @throws {Error} Throws an error if fetchData is not a function.
   * @returns The current PageConfig instance.
   */
  setFetchData(fetchData: Function): PageConfig {
    if (typeof fetchData !== 'function') throw new Error('fetchData must be a function.');
    this._config.fetchData = fetchData;
    return this;
  }

  /**
   * Finalizes the configuration and returns a read-only object representing the page configuration.
   * @throws {Error} Throws an error if the path has not been set.
   * @returns A read-only object representing the finalized page configuration.
   */
  finalize(): Readonly<PageConfigInterface> {
    if (!this._config.path) throw new Error('Path must be set before finalizing.');
    return Object.freeze({ ...this._config });
  }
}
