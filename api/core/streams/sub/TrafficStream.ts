import { Time } from '../../lib';
import { DataStream } from '../DataStream';

// Quick Test Stream
export class TrafficStream extends DataStream<number> {
  private intervalId: NodeJS.Timeout | null = null;
  private index: number = 1;

  public async start(): Promise<void> {
    this._isActive = true;
    this.intervalId = setInterval(async () => {
      this.pushData(this.index);
      this.index++;
    }, Time.Minutes * 1);
  }

  public async stop(): Promise<void> {
    this._isActive = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
