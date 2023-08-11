import { LoggerNames } from '../enums';
import { LoggerControllerConfig } from '../types';
import { LoggerController } from './LoggerController';
import pino from 'pino';

describe('LoggerController', () => {
  let config: LoggerControllerConfig;

  beforeEach(() => {
    config = {
      name: LoggerNames.APP,
      level: 'info',
      verbose: true,
    };
  });

  describe('constructor', () => {
    it('should create a LoggerController instance with the given configuration', () => {
      const loggerController = new LoggerController(config);

      expect(loggerController.logger).toBeDefined();
      expect(loggerController.defaultLevel).toBe('trace');
      expect(loggerController.verbose).toBe(true);
      expect(loggerController.isEnabled).toBe(true);
    });

    it('should create a LoggerController instance with default values if no configuration is provided', () => {
      const loggerController = new LoggerController();

      expect(loggerController.logger).toBeDefined();
      expect(loggerController.defaultLevel).toBe('trace');
      expect(loggerController.verbose).toBe(true);
      expect(loggerController.isEnabled).toBe(true);
    });
  });

  describe('disable', () => {
    it('should disable the logger', () => {
      const loggerController = new LoggerController(config);

      loggerController.disable();

      expect(loggerController.isEnabled).toBe(false);
    });
  });

  describe('enable', () => {
    it('should enable the logger', () => {
      const loggerController = new LoggerController(config, false);

      loggerController.enable();

      expect(loggerController.isEnabled).toBe(true);
    });
  });
});
