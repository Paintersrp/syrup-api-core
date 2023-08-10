class QueueNode<T> {
  constructor(
    public value: T,
    public next: QueueNode<T> | null = null,
    public prev: QueueNode<T> | null = null
  ) {}
}

export class Queue<T> {
  private head: QueueNode<T> | null = null;
  private tail: QueueNode<T> | null = null;

  public enqueue(item: T): void {
    const newNode = new QueueNode(item);
    if (this.tail) {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    } else {
      this.head = this.tail = newNode;
    }
  }

  public dequeue(): T | null {
    if (this.head) {
      const value = this.head.value;
      this.head = this.head.next;
      if (this.head) this.head.prev = null;
      else this.tail = null;
      return value;
    }
    return null;
  }

  public peek(): T | null {
    return this.head ? this.head.value : null;
  }

  public isEmpty(): boolean {
    return this.head === null;
  }
}
