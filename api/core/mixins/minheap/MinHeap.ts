export class MinHeap<T> {
  private heap: T[] = [];

  constructor(private comparator: (a: T, b: T) => number) {}

  private getLeftChildIndex(parentIndex: number): number {
    return 2 * parentIndex + 1;
  }

  private getRightChildIndex(parentIndex: number): number {
    return 2 * parentIndex + 2;
  }

  private getParentIndex(childIndex: number): number {
    return Math.floor((childIndex - 1) / 2);
  }

  private swap(indexOne: number, indexTwo: number): void {
    const temp = this.heap[indexOne];
    this.heap[indexOne] = this.heap[indexTwo];
    this.heap[indexTwo] = temp;
  }

  private heapifyUp(): void {
    let currentIndex = this.heap.length - 1;
    while (
      currentIndex > 0 &&
      this.comparator(this.heap[this.getParentIndex(currentIndex)], this.heap[currentIndex]) > 0
    ) {
      this.swap(this.getParentIndex(currentIndex), currentIndex);
      currentIndex = this.getParentIndex(currentIndex);
    }
  }

  private heapifyDown(): void {
    let currentIndex = 0;
    while (this.getLeftChildIndex(currentIndex) < this.heap.length) {
      let smallestChildIndex = this.getLeftChildIndex(currentIndex);
      if (
        this.getRightChildIndex(currentIndex) < this.heap.length &&
        this.comparator(
          this.heap[this.getRightChildIndex(currentIndex)],
          this.heap[smallestChildIndex]
        ) < 0
      ) {
        smallestChildIndex = this.getRightChildIndex(currentIndex);
      }
      if (this.comparator(this.heap[currentIndex], this.heap[smallestChildIndex]) <= 0) {
        break;
      } else {
        this.swap(currentIndex, smallestChildIndex);
        currentIndex = smallestChildIndex;
      }
    }
  }

  public insert(value: T): void {
    this.heap.push(value);
    this.heapifyUp();
  }

  public extractMin(): T | null {
    if (this.isEmpty()) return null;
    const root = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown();
    return root;
  }

  public peek(): T | null {
    if (this.isEmpty()) return null;
    return this.heap[0];
  }

  public size(): number {
    return this.heap.length;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }
}
