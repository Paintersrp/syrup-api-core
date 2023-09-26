import React, { ReactElement } from 'react';

export type RouteProps = {
  path: string;
  component: ReactElement;
  beforeEnter?: () => boolean;
};

export const Route: React.FC<RouteProps> = (props) => {
  const { component, beforeEnter } = props;

  if (beforeEnter && !beforeEnter()) {
    return null;
  }

  return React.cloneElement(component);
};

export default Route;
