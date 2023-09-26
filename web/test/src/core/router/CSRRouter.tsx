import React, { useState, useEffect, ReactElement } from 'react';
import { RouteProps } from './components/Route';
import { useParamContext } from './params/ParamContext';

type RouteElement = React.ReactElement<RouteProps>;

type RouterProps = {
  loadingComponent: ReactElement;
  children: ReactElement[];
};

const matchRoute = (path: string, routePath: string): Record<string, string> | null => {
  const pathSegments = path.split('/').filter(Boolean);
  const routeSegments = routePath.split('/').filter(Boolean);

  if (pathSegments.length !== routeSegments.length) return null;

  const params: Record<string, string> = {};

  const matched = routeSegments.every((segment, i) => {
    if (segment.startsWith(':')) {
      params[segment.slice(1)] = pathSegments[i];
      return true;
    }
    return segment === pathSegments[i];
  });

  return matched ? params : null;
};

const findAllRoutes = (children: React.ReactNode[]): RouteElement[] => {
  const routes: RouteElement[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement<RouteProps>(child) && 'path' in child.props) {
      routes.push(child as RouteElement);
    }
    if (React.isValidElement(child) && child.props.children) {
      routes.push(...findAllRoutes(React.Children.toArray(child.props.children)));
    }
  });
  return routes;
};

export const CSRRouter: React.FC<RouterProps> = ({ loadingComponent, children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [matchedRoute, setMatchedRoute] = useState<ReactElement | null>(null);
  const { setParams } = useParamContext();

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', onLocationChange);

    return () => {
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  useEffect(() => {
    const allRoutes = findAllRoutes(React.Children.toArray(children));
    const routeElement = allRoutes.find((route) => {
      const params = matchRoute(currentPath, route.props.path);
      return !!params;
    });

    if (routeElement) {
      const params = matchRoute(currentPath, routeElement.props.path);
      if (params) {
        setParams(params);
        setMatchedRoute(React.cloneElement(routeElement));
      }
    } else {
      setMatchedRoute(null);
    }
  }, [currentPath, children, setParams]);

  return matchedRoute || loadingComponent;
};

export default CSRRouter;
