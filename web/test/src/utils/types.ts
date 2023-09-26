import { ReactElement } from 'react';
import { RouteObject } from 'react-router-dom';

export interface NavLink {
  label: string;
  path: string;
  children?: NavLink[];
}

export interface RouteConfig {
  path: string;
  hasIndex: boolean;
  nestedRoutes: RouteConfig[] | null;
  layout: string;
}

export type GeneratedRoute = {
  path: string;
  element?: ReactElement;
  children?: GeneratedRoute[];
} & Partial<RouteObject>;
