export class MinHeap {
  private heap: [number, string][] = [];

  add(element: [number, string]) {
    this.heap.push(element);
    let current = this.heap.length - 1;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (this.heap[current][0] >= this.heap[parent][0]) break;
      [this.heap[current], this.heap[parent]] = [this.heap[parent], this.heap[current]];
      current = parent;
    }
  }

  remove() {
    const top = this.heap[0];
    const end = this.heap.pop() as [number, string];
    if (this.heap.length > 0) {
      this.heap[0] = end;
      let current = 0;
      while (true) {
        let largest = current;
        const left = 2 * current + 1;
        const right = 2 * current + 2;
        if (left < this.heap.length && this.heap[left][0] < this.heap[largest][0]) largest = left;
        if (right < this.heap.length && this.heap[right][0] < this.heap[largest][0])
          largest = right;
        if (largest === current) break;
        [this.heap[current], this.heap[largest]] = [this.heap[largest], this.heap[current]];
        current = largest;
      }
    }
    return top;
  }

  peek() {
    return this.heap[0];
  }

  size() {
    return this.heap.length;
  }
}
