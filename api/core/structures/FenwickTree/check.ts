import { FenwickTree } from './FenwickTree';

export function testFenwickTree() {
  const arr = [1, 3, 5, 7, 9, 11];
  const fenwickTree = new FenwickTree(arr);

  console.assert(fenwickTree.query(3) === 16, 'Prefix sum up to index 3 failed!');
  console.assert(fenwickTree.rangeQuery(1, 4) === 24, 'Range Query [1, 4] failed!');
  console.assert(
    fenwickTree.rangeQuery(0, 5) === arr.reduce((a, b) => a + b, 0),
    'Range Query full range failed!'
  );

  fenwickTree.update(3, 3); // Add 3 to value at index 3
  console.assert(fenwickTree.query(3) === 19, 'Prefix sum up to index 3 after update failed!');
  console.assert(
    fenwickTree.rangeQuery(3, 3) === 10,
    'Range Query single index after update failed!'
  );

  console.log('All Fenwick Tree tests passed!');
}
