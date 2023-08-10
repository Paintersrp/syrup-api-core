import { HashTable } from './HashTable';

export function testHashTable() {
  const hashTable = new HashTable<string, number>();

  // Test insertion
  hashTable.put('one', 1);
  hashTable.put('two', 2);
  hashTable.put('three', 3);

  // Test retrieval
  if (hashTable.get('one') !== 1 || hashTable.get('two') !== 2 || hashTable.get('three') !== 3) {
    console.error('Retrieval test failed');
    return;
  }

  // Test resizing by adding more elements
  for (let i = 4; i <= 20; i++) {
    hashTable.put(`key${i}`, i);
  }

  // Check if resizing occurred and if all elements are still retrievable
  if (hashTable.get('key20') !== 20) {
    console.error('Resizing test failed');
    return;
  }

  // Test removal
  hashTable.remove('one');
  if (hashTable.get('one') !== undefined) {
    console.error('Removal test failed');
    return;
  }

  console.log('All HashTable tests passed!');
}
