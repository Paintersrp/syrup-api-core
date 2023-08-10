import { testHashTable } from './HashTable/check';
import { testQueue } from './Queue/check';
import { testStack } from './Stack/check';
import { testRedBlackTree } from './RedBlackTree/check';
import { testSegmentTree } from './SegmentTree/check';
import { testFenwickTree } from './FenwickTree/check';
import { testBinaryHeap } from './BinaryHeap/check';
import { testMinHeap } from './MinHeap/check';
import { testCircularBuffer } from './CircularBuffer/check';

export function testAllStructures() {
  testMinHeap();
  testBinaryHeap();
  testHashTable();
  testQueue();
  testStack();
  testRedBlackTree();
  testSegmentTree();
  testFenwickTree();
  testCircularBuffer();
}
