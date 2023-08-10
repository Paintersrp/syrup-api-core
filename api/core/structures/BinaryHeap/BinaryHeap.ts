export class BinaryHeap<T> {
  private heap: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number) {
    this.compare = compare;
  }

  public size(): number {
    return this.heap.length;
  }

  public peek(): T {
    if (this.heap.length === 0) {
      throw new Error('Heap is empty');
    }
    return this.heap[0];
  }

  public push(value: T): void {
    this.heap.push(value);
    this.bubbleUp(this.heap.length - 1);
  }

  public pop(): T {
    if (this.heap.length === 0) {
      throw new Error('Heap is empty');
    }
    const result = this.heap[0];
    const end = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.sinkDown(0);
    }
    return result;
  }

  private bubbleUp(n: number): void {
    const value = this.heap[n];
    while (n > 0) {
      const parentN = Math.floor((n + 1) / 2) - 1;
      const parent = this.heap[parentN];
      if (this.compare(parent, value) <= 0) {
        break;
      }
      this.heap[parentN] = value;
      this.heap[n] = parent;
      n = parentN;
    }
  }

  private sinkDown(n: number): void {
    const length = this.heap.length;
    const value = this.heap[n];
    while (true) {
      const child2N = (n + 1) * 2;
      const child1N = child2N - 1;
      let swap = null;
      if (child1N < length) {
        const child1 = this.heap[child1N];
        if (this.compare(child1, value) < 0) {
          swap = child1N;
        }
      }
      if (child2N < length) {
        const child2 = this.heap[child2N];
        if (this.compare(child2, swap === null ? value : this.heap[child1N]) < 0) {
          swap = child2N;
        }
      }
      if (swap === null) {
        break;
      }
      this.heap[n] = this.heap[swap];
      this.heap[swap] = value;
      n = swap;
    }
  }

  public toArray(): T[] {
    return [...this.heap];
  }
}
