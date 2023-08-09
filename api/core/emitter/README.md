# Emitter: Advanced Usage Guide

Elevate your event-driven architecture with the robust capabilities of the `Emitter` class. This guide delves deep into its advanced features, advocates best practices, and showcases tutorials for real-world scenarios.

## Table of Contents

- Advanced Features
  - Middleware Support
  - Event Hierarchy & Relationships
  - Conditional Event Triggering
  - Event Grouping & Bulk Operations
- Best Practices for Emitter Mastery
- Hands-on Tutorials
  - Centralized Logging with Emitter
  - Enhancing Koa with Emitter
  - React Lifecycle Monitoring

## Advanced Features

### 1. Middleware Support

Middlewares empower you to intercept or adapt event data seamlessly before it reaches listeners. This is invaluable for logging, modification, or validation of event data.

```typescript
const emitter = new Emitter();

// Middleware for detailed logging
emitter.use((event, payload) => {
  console.log(`[${new Date().toISOString()}] Event: "${event}" | Data:`, payload);
});
```

### 2. Event Hierarchy & Relationships

Craft sophisticated relationships between events. Emitting a child event can cascade and trigger parent events, providing a layered response mechanism.

```typescript
emitter.setHierarchy('purchaseCompleted', ['updateInventory', 'sendThankYouEmail']);

// Emitting 'purchaseCompleted' cascades and triggers parent events.
emitter.emit('purchaseCompleted', { userId: 123, item: 'book' });
```

### 3. Conditional Event Triggering

Incorporate condition functions to gain granular control over when listeners are activated.

```typescript
// Notify admin only for high-value transactions.
emitter.on(
  'transaction',
  (event, amount) => {
    console.log(`High-value transaction detected: $${amount}`);
  },
  (amount) => amount > 1000
);

emitter.emit('transaction', 1500);
```

### 4. Event Grouping & Bulk Operations

Bundle events for cohesive management. Especially potent for modules or features that need orchestrated event handling.

```typescript
emitter.addToGroup('userOnboarding', ['sendWelcomeEmail', 'initiateTutorial', 'alertAdmin']);

// Kickstart the entire onboarding process with one command.
emitter.emitGroup('userOnboarding', { userId: 456 });
```

## Best Practices for Emitter Mastery

1. **Descriptive Event Names**: Adopt a naming convention that clearly articulates the event's purpose.
2. **Event Granularity**: While it's tempting to have an event for everything, strive for a balance to avoid an overwhelming event landscape.
3. **Mindful Propagation**: Be discerning with event hierarchies to avoid unintended ripple effects.
4. **Conscientious Cleanup**: Regularly purge unused listeners to conserve memory and ensure optimal performance.
5. **Sensible Middleware Utilization**: While potent, over-reliance on middleware can obfuscate flow and impact performance.

## Hands-on Tutorials

### Centralized Logging with Emitter

Leverage `Emitter` to construct a centralized logging mechanism.

```typescript
const logEmitter = new Emitter();

logEmitter.use((event, message, level = 'INFO') => {
  console.log(`[${level}] ${event}: ${message}`);
});

logEmitter.emit('DATABASE', 'Connection established', 'SUCCESS');
logEmitter.emit('AUTH', 'Invalid user credentials', 'ERROR');
```

### Enhancing Koa with Emitter

Infuse your Koa server with `Emitter` to handle request-response cycles efficiently.

```typescript
import Koa from 'koa';
import { Emitter } from './Emitter';

const app = new Koa();
const koaEmitter = new Emitter();

app.use(async (ctx, next) => {
  koaEmitter.emit('REQUEST_RECEIVED', ctx.method, ctx.path);
  await next();
  koaEmitter.emit('RESPONSE_SENT', ctx.status);
});

koaEmitter.on('REQUEST_RECEIVED', (event, method, path) => {
  console.log(`Handling ${method} request on ${path}`);
});

koaEmitter.on('RESPONSE_SENT', (event, status) => {
  console.log(`Response sent with status code: ${status}`);
});

app.listen(3000);
```

### React Lifecycle Monitoring

Monitor React component lifecycles and interactions using `Emitter`.

```tsx
import React, { useEffect } from 'react';
import { Emitter } from './Emitter';

const reactEmitter = new Emitter();

const UserComponent: React.FC = () => {
  useEffect(() => {
    reactEmitter.emit('COMPONENT_MOUNTED', 'UserComponent');
    return () => {
      reactEmitter.emit('COMPONENT_UNMOUNTED', 'UserComponent');
    };
  }, []);

  return <button onClick={() => reactEmitter.emit('USER_CLICKED')}>Click Me</button>;
};
```

---
