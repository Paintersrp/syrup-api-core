import { SegmentTree } from './SegmentTree';

export function testSegmentTree() {
  const arr = [1, 3, 5, 7, 9, 11];
  const segmentTree = new SegmentTree(arr);

  console.assert(segmentTree.query(1, 3) === 15, 'Query [1, 3] failed!');
  console.assert(segmentTree.query(2, 4) === 21, 'Query [2, 4] failed!');
  console.assert(
    segmentTree.query(0, 5) === arr.reduce((a, b) => a + b, 0),
    'Query full range failed!'
  );

  segmentTree.update(3, 10); // Update value at index 3 to 10
  console.assert(segmentTree.query(1, 3) === 18, 'Query [1, 3] after update failed!');
  console.assert(segmentTree.query(3, 3) === 10, 'Query single index after update failed!');

  console.log('All Segment Tree tests passed!');
}
