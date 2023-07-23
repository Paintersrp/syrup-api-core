export class SyMinHeapMixin<T> {
  private heap: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number) {
    this.compare = compare;
  }

  private parentIndex(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  private leftChildIndex(i: number): number {
    return 2 * i + 1;
  }

  private rightChildIndex(i: number): number {
    return 2 * i + 2;
  }

  private swap(i: number, j: number): void {
    let temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  add(item: T): void {
    this.heap.push(item);
    let i = this.heap.length - 1;
    while (i > 0 && this.compare(this.heap[i], this.heap[this.parentIndex(i)]) < 0) {
      this.swap(i, this.parentIndex(i));
      i = this.parentIndex(i);
    }
  }

  poll(): T | undefined {
    if (this.heap.length === 0) {
      return undefined;
    }
    let root = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    this.heapify(0);
    return root;
  }

  remove(item: T): void {
    const i = this.heap.indexOf(item);
    if (i !== -1) {
      this.heap[i] = this.heap[this.heap.length - 1];
      this.heap.pop();
      this.heapify(i);
    }
  }

  heapify(i: number): void {
    let smallest = i;
    let left = this.leftChildIndex(i);
    let right = this.rightChildIndex(i);

    if (left < this.heap.length && this.compare(this.heap[left], this.heap[smallest]) < 0) {
      smallest = left;
    }

    if (right < this.heap.length && this.compare(this.heap[right], this.heap[smallest]) < 0) {
      smallest = right;
    }

    if (smallest !== i) {
      this.swap(i, smallest);
      this.heapify(smallest);
    }
  }

  clear(): void {
    this.heap = [];
  }
}
