import { SSEHandler } from './SSEHandler';
import { strategies } from './strategies';
import { EventPayload, IEventHandler } from './types';

export class SSEManager {
  private channels: Map<string, Set<(message: EventPayload) => void>> = new Map();
  private eventHandler: IEventHandler;

  constructor(eventHandler?: IEventHandler) {
    this.eventHandler = eventHandler || new SSEHandler(this, strategies);
  }

  public handleEvent(event: EventPayload) {
    this.eventHandler.handleEvent(event);
  }

  public joinChannel(channelName: string, send: (message: EventPayload) => void) {
    const channel = this.channels.get(channelName) || new Set();
    channel.add(send);
    this.channels.set(channelName, channel);
  }

  public leaveChannel(channelName: string, send: (message: EventPayload) => void) {
    const channel = this.channels.get(channelName);
    if (channel) {
      channel.delete(send);
    }
  }

  public sendToChannel(channelName: string, message: EventPayload) {
    this.channels.get(channelName)?.forEach((send) => send(message));
  }

  public broadcast(message: EventPayload) {
    this.channels.forEach((channel) => channel.forEach((send) => send(message)));
  }

  public getUserChannels(role: string, userId: string): string[] {
    const channels = [`user-${userId}`, 'user-notifications'];

    if (role === 'admin') {
      channels.push('admin-notifications');
    }

    return channels;
  }
}

export const sseManager = new SSEManager();
