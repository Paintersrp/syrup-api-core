class StackNode<T> {
  constructor(public value: T, public next: StackNode<T> | null = null) {}
}

export class Stack<T> {
  private top: StackNode<T> | null = null;

  public push(item: T): void {
    this.top = new StackNode(item, this.top);
  }

  public pop(): T | null {
    if (this.top) {
      const value = this.top.value;
      this.top = this.top.next;
      return value;
    }
    return null;
  }

  public peek(): T | null {
    return this.top ? this.top.value : null;
  }

  public isEmpty(): boolean {
    return this.top === null;
  }
}
