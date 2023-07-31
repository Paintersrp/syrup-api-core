import helmet from 'koa-helmet';
import { Interval } from '../core/lib';

const cspConfiguration = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
    childSrc: ["'none'"],
    connectSrc: ["'none'"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
  },
};

const hstsConfiguration = {
  maxAge: (Interval.Weekly / 1000) * 18,
  includeSubDomains: true,
  preload: true,
};

const frameguardConfiguration = {
  action: 'sameorigin' as const,
};

const helmetOptions = {
  contentSecurityPolicy: cspConfiguration,
  hsts: hstsConfiguration,
  frameguard: frameguardConfiguration,
  noSniff: true,
};

export const helmetMiddleware = helmet(helmetOptions);
