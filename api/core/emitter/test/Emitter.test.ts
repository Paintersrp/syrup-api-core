import { Emitter } from '../Emitter';
import { MiddlewareManager, WildcardManager } from '../managers';

describe('Emitter', () => {
  let emitter: Emitter;

  beforeEach(() => {
    emitter = new Emitter();
  });

  describe('use', () => {
    it('should register middleware and call it on emit', () => {
      const middleware1 = jest.fn(() => true);
      const middleware2 = jest.fn(() => false);
      const middleware3 = jest.fn(() => true);

      emitter.use(middleware1);
      emitter.use(middleware2);
      emitter.use(middleware3);

      const result = (emitter as any).middlewareManager.process('test-event', 1, 2, 3);

      expect(result).toBe(false);
      emitter.emit('test-event');
      expect(middleware1).toHaveBeenCalled();
      expect(middleware2).toHaveBeenCalled();
      expect(middleware3).not.toHaveBeenCalled();
    });
  });

  describe('on', () => {
    it('should register a wildcard listener and call it on emit', () => {
      const listener = jest.fn();
      const wildcardManager = new WildcardManager();

      const emitSpy = jest.spyOn(wildcardManager, 'emit');

      emitter['wildcardManager'] = wildcardManager;
      emitter.on('*', listener);
      emitter.emit('test-event');

      expect(emitSpy).toHaveBeenCalledWith('test-event');
    });
  });

  describe('off', () => {
    it('should remove a registered event listener and not call it on emit', () => {
      const listener = jest.fn();
      emitter.on('test-event', listener);
      emitter.off('test-event', listener);
      emitter.emit('test-event');
      expect(listener).not.toHaveBeenCalled();
    });

    it('should remove a wildcard listener when event is *', () => {
      const listener = jest.fn();
      const wildcardManager = new WildcardManager();
      const offSpy = jest.spyOn(wildcardManager, 'off');

      emitter['wildcardManager'] = wildcardManager;
      emitter.on('*', listener);
      emitter.off('*', listener);

      expect(offSpy).toHaveBeenCalledWith(listener);
    });

    it('should remove a non-wildcard listener', () => {
      const listener = jest.fn();
      emitter.on('test-event', listener);
      emitter.off('test-event', listener);
      emitter.emit('test-event');
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('emit', () => {
    it('should emit an event and return true', () => {
      const listener = jest.fn();
      emitter.on('test-event', listener);
      expect(emitter.emit('test-event')).toBe(true);
      expect(listener).toHaveBeenCalled();
    });

    it('should return false if middlewareManager.process returns false', () => {
      const event = 'test-event';
      const args = [1, 2, 3];

      const middlewareManager = new MiddlewareManager();
      jest.spyOn(middlewareManager, 'process').mockReturnValue(false);

      emitter['middlewareManager'] = middlewareManager;

      const result = emitter.emit(event, ...args);

      expect(result).toBe(false);
    });
  });

  describe('getEvents', () => {
    it('should retrieve the map of all registered events', () => {
      const listener = jest.fn();
      emitter.on('test-event', listener);
      expect(emitter.getEvents()).toBeInstanceOf(Map);
    });
  });

  describe('setHierarchy', () => {
    it('should set a hierarchy of events', () => {
      emitter.setHierarchy('test-event', ['parent-event1', 'parent-event2']);
      const hierarchy = (emitter as any).eventManager.hierarchy.get('test-event');
      expect(hierarchy).toEqual(['parent-event1', 'parent-event2']);
    });
  });

  describe('setGroup', () => {
    it('should add an event to a specific group', () => {
      emitter.setGroup('test-group', 'test-event1');
      emitter.setGroup('test-group', 'test-event2');
      const groupEvents = (emitter as any).groupManager.groups.get('test-group');
      expect(groupEvents).toEqual(['test-event1', 'test-event2']);
    });
  });

  describe('emitGroup', () => {
    it('should emit all events associated with a specific group', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      emitter.on('test-event1', listener1);
      emitter.on('test-event2', listener2);
      emitter.setGroup('test-group', 'test-event1');
      emitter.setGroup('test-group', 'test-event2');

      emitter.emitGroup('test-group');

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });
  });

  describe('getGroups', () => {
    it('should return the correct map of groups', () => {
      emitter.setGroup('group1', 'event1');
      emitter.setGroup('group1', 'event2');
      emitter.setGroup('group2', 'event3');

      const groups = (emitter as any).groupManager.getGroups();

      expect(groups.get('group1')).toEqual(['event1', 'event2']);
      expect(groups.get('group2')).toEqual(['event3']);
    });
  });

  describe('removeAllListenersFromGroup', () => {
    it('should remove all listeners associated with a specific group', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      emitter.on('test-event1', listener1);
      emitter.on('test-event2', listener2);
      emitter.setGroup('test-group', 'test-event1');
      emitter.setGroup('test-group', 'test-event2');

      emitter.removeAllListenersFromGroup('test-group');
      emitter.emit('test-event1');
      emitter.emit('test-event2');

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
    });
  });

  describe('removeStaleListeners', () => {
    it('should remove event listeners that are considered stale', () => {
      jest.useFakeTimers();

      const listener = jest.fn();

      emitter.on('test-event', listener);
      emitter.setStaleDuration(500);

      setTimeout(() => {
        emitter.removeStaleListeners();
      }, 1000);

      jest.runAllTimers();

      emitter.emit('test-event');

      expect(listener).not.toHaveBeenCalled();

      jest.useRealTimers();
    });
  });

  describe('setStaleDuration', () => {
    it('should set the duration after which listeners are considered stale', () => {
      jest.useFakeTimers();

      const listener = jest.fn();

      emitter.on('test-event', listener);
      emitter.setStaleDuration(500);

      setTimeout(() => {
        emitter.removeStaleListeners();
      }, 1000);

      jest.runAllTimers();

      emitter.emit('test-event');

      expect(listener).not.toHaveBeenCalled();

      jest.useRealTimers();
    });
  });
});
