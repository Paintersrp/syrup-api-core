export class CircularBuffer<T> {
  private buffer: T[];
  private size: number;
  private start: number = 0;
  private end: number = 0;
  private count: number = 0;

  constructor(size: number) {
    this.size = size;
    this.buffer = new Array(size);
  }

  public enqueue(item: T): void {
    if (this.isFull()) {
      this.start = (this.start + 1) % this.size;
    }
    this.buffer[this.end] = item;
    this.end = (this.end + 1) % this.size;
    if (this.count < this.size) this.count++;
  }

  public dequeue(): T | null {
    if (this.isEmpty()) return null;
    const item = this.buffer[this.start];
    this.start = (this.start + 1) % this.size;
    this.count--;
    return item;
  }

  public peek(): T | null {
    return this.isEmpty() ? null : this.buffer[this.start];
  }

  public isEmpty(): boolean {
    return this.count === 0;
  }

  public isFull(): boolean {
    return this.count === this.size;
  }

  public getSize(): number {
    return this.count;
  }
}
