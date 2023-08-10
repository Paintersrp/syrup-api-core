import { BinaryHeap } from './BinaryHeap';

export function testBinaryHeap() {
  const minHeapCompare = (a: number, b: number) => a - b;
  const maxHeapCompare = (a: number, b: number) => b - a;

  const minHeap = new BinaryHeap(minHeapCompare);
  console.assert(minHeap.size() === 0, 'Min Heap initial size failed!');

  minHeap.push(3);
  minHeap.push(1);
  minHeap.push(5);
  minHeap.push(2);

  console.assert(minHeap.peek() === 1, 'Min Heap peek failed!');
  console.assert(minHeap.pop() === 1, 'Min Heap pop failed!');
  console.assert(minHeap.size() === 3, 'Min Heap size after pop failed!');

  const maxHeap = new BinaryHeap(maxHeapCompare);
  console.assert(maxHeap.size() === 0, 'Max Heap initial size failed!');

  maxHeap.push(3);
  maxHeap.push(1);
  maxHeap.push(5);
  maxHeap.push(2);

  console.assert(maxHeap.peek() === 5, 'Max Heap peek failed!');
  console.assert(maxHeap.pop() === 5, 'Max Heap pop failed!');
  console.assert(maxHeap.size() === 3, 'Max Heap size after pop failed!');

  console.log('All Binary Heap tests passed!');
}
