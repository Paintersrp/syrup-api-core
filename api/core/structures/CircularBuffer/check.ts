import { CircularBuffer } from './CircularBuffer';

export function testCircularBuffer() {
  const bufferSize = 5;
  const buffer = new CircularBuffer<number>(bufferSize);

  // Test enqueuing and dequeuing
  for (let i = 1; i <= bufferSize; i++) {
    buffer.enqueue(i);
  }

  // Test overflow (overwrite oldest data)
  buffer.enqueue(6);
  console.assert(buffer.dequeue() === 2, 'First item should be overwritten');

  // Test peek
  console.assert(buffer.peek() === 3, 'Peek should return the current first item');

  // Stress test
  const stressSize = 1000000;
  const stressBuffer = new CircularBuffer<number>(stressSize);
  for (let i = 0; i < stressSize; i++) {
    stressBuffer.enqueue(i);
  }
  stressBuffer.enqueue(stressSize);
  console.assert(stressBuffer.dequeue() === 1, 'Stress test dequeue should match');

  // Test dequeuing until empty
  for (let i = 3; i <= 6; i++) {
    console.assert(buffer.dequeue() === i, `Dequeue should return ${i}`);
  }
  console.assert(buffer.isEmpty() === true, 'Buffer should be empty');

  // Test dequeuing from empty buffer
  console.assert(buffer.dequeue() === null, 'Dequeue from empty buffer should return null');

  console.log('All Circular Buffer tests passed.');
}
