import { FixedAbstractQuery, FixedQueryOptions } from '../../../database/services/queries/types';
import { QueryLogObject } from '../QueryLogObject';

describe('QueryLogObject', () => {
  describe('generate', () => {
    it('should create a QueryLogObject instance with the given parameters', () => {
      const sqlParameters: string[] = ['id', 'name'];
      const options: FixedQueryOptions = {
        type: 'select',
        attributes: sqlParameters,
      };
      const meta: FixedAbstractQuery = {
        uuid: 'test-uuid',
        sql: 'SELECT * FROM users',
        model: { name: 'User' } as any,
      } as FixedAbstractQuery;

      const duration = 100;

      const logObject = QueryLogObject.generate(options, meta, duration);

      expect(logObject.id).toBe('test-uuid');
      expect(logObject.type).toBe('select');
      expect(logObject.modelName).toBe('User');
      expect(logObject.sql).toBe('SELECT * FROM users');
      expect(logObject.duration).toBe(100);
      expect(logObject.sqlParameters).toEqual(sqlParameters);
      expect(logObject.queryOptions).toEqual(options);
      expect(logObject.queryMeta).toEqual(meta);
    });
  });

  describe('generateLogString', () => {
    it('should generate a log string with the correct format', () => {
      const logObject = new QueryLogObject(
        'test-uuid',
        'select',
        'User',
        'SELECT * FROM users',
        100,
        null,
        {} as FixedQueryOptions,
        {} as FixedAbstractQuery
      );

      const logString = logObject.generateLogString();

      expect(logString).toBe('Query select on model User took 100ms [SQL: SELECT * FROM users]');
    });
  });
});
