import { NavLink, RouteConfig } from './types';
import { memoize } from 'lodash';
import routesConfig from '../routesConfig.json';
import config from '../../syrup.config';

const generateLinks = (routes: RouteConfig[], basePath = '', rootLink?: NavLink): NavLink[] => {
  return routes.flatMap((route): NavLink[] => {
    if (route.path.startsWith(':') || !route.hasIndex) return [];

    const fullPath = `${basePath}/${route.path}`.replace(/\/\//g, '/');
    const label = route.path.charAt(0).toUpperCase() + route.path.slice(1);

    const link: NavLink = {
      label,
      path: fullPath,
    };

    if (rootLink) {
      rootLink.children = rootLink.children || [];
      rootLink.children.push(link);
    }

    if (route.nestedRoutes) {
      generateLinks(route.nestedRoutes, fullPath, rootLink || link);
    }

    return rootLink ? [] : [link];
  });
};

export const getLinks = memoize((): NavLink[] => {
  const links = generateLinks(routesConfig);

  if (config.customLinkOrder) {
    links.sort((a, b) => {
      const aIndex = config.customLinkOrder!.indexOf(a.path.split('/')[1]);
      const bIndex = config.customLinkOrder!.indexOf(b.path.split('/')[1]);

      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;

      return aIndex - bIndex;
    });
  }

  return links;
});
