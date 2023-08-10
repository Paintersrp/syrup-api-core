import { MinHeap } from './MinHeap';

export function testMinHeap() {
  const minHeap = new MinHeap();

  // Test initial size
  console.assert(minHeap.size() === 0, 'Initial size failed!');

  // Test add
  minHeap.add([3, 'three']);
  minHeap.add([1, 'one']);
  minHeap.add([5, 'five']);
  minHeap.add([2, 'two']);

  // Test peek
  console.assert(minHeap.peek()[0] === 1 && minHeap.peek()[1] === 'one', 'Peek failed!');

  // Test size
  console.assert(minHeap.size() === 4, 'Size after adding elements failed!');

  // Test remove
  const removed1 = minHeap.remove();
  console.assert(removed1[0] === 1 && removed1[1] === 'one', 'Remove failed!');
  console.assert(minHeap.size() === 3, 'Size after remove failed!');

  // Test remaining elements
  const removed2 = minHeap.remove();
  console.assert(removed2[0] === 2 && removed2[1] === 'two', 'Remove failed!');

  const removed3 = minHeap.remove();
  console.assert(removed3[0] === 3 && removed3[1] === 'three', 'Remove failed!');

  const removed4 = minHeap.remove();
  console.assert(removed4[0] === 5 && removed4[1] === 'five', 'Remove failed!');

  // Test size after all elements are removed
  console.assert(minHeap.size() === 0, 'Final size failed!');

  console.log('All Min Heap tests passed!');
}
