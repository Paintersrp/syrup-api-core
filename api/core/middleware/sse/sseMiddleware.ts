import { Context, Next } from 'koa';
import { SSEManager } from '../../sse/SSEManager';
import { EventPayload, EventType } from '../../sse/types';

export const sseMiddleware = (sseManager: SSEManager) => async (ctx: Context, next: Next) => {
  if (ctx.path === '/notifications') {
    ctx.status = 200;
    ctx.type = 'text/event-stream';
    ctx.set('Cache-Control', 'no-cache');
    ctx.set('Connection', 'keep-alive');

    const send = (message: EventPayload) => {
      ctx.res.write(`data: ${JSON.stringify(message)}\n\n`);
    };

    // Determine channels based on user role and user ID
    const user = ctx.session?.user || { role: 'Guest', userId: 'Anonymous' };
    const channels = sseManager.getUserChannels(user.role, user.userId);

    // Join each channel
    channels.forEach((channelName) => {
      sseManager.joinChannel(channelName, send);
    });

    // Keep the connection open
    await new Promise<void>((resolve) => {
      ctx.req.on('close', () => {
        // Leave each channel
        channels.forEach((channelName) => {
          sseManager.leaveChannel(channelName, send);
        });
        resolve();
      });
    });
  }
  if (ctx.path === '/steet') {
    const lyrics = [
      "We're no strangers to love",
      'You know the rules and so do I (Do I)',
      "A full commitment's what I'm thinking of",
      "You wouldn't get this from any other guy",
      "I just wanna tell you how I'm feeling",
      'Gotta make you understand',
      'Never gonna give you up',
      'Never gonna let you down',
      'Never gonna run around and desert you',
      'Never gonna make you cry',
      'Never gonna say goodbye',
      'Never gonna tell a lie and hurt you',
      "We've known each other for so long",
      "Your heart's been aching, but you're too shy to say it (To say it)",
      "Inside, we both know what's been going on (Going on)",
      "We know the game, and we're gonna play it",
      "And if you ask me how I'm feeling",
      "Don't tell me you're too blind to see",
      'Never gonna give you up',
      'Never gonna let you down',
      'Never gonna run around and desert you',
      'Never gonna make you cry',
      'Never gonna say goodbye',
      'Never gonna tell a lie and hurt you',
      'Never gonna give you up',
      'Never gonna let you down',
      'Never gonna run around and desert you',
      'Never gonna make you cry',
      'Never gonna say goodbye',
      'Never gonna tell a lie and hurt you',
    ];

    // Send each line of the lyrics with a delay
    lyrics.forEach((line, index) => {
      setTimeout(() => {
        sseManager.handleEvent({
          type: EventType.SystemAlert,
          data: { message: line, severity: 'low' },
        });
      }, index * 500);
    });
  } else {
    await next();
  }
};
