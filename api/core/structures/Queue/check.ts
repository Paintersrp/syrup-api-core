import { Queue } from './Queue';

export function testQueue() {
  const queue = new Queue<number>();

  console.assert(queue.isEmpty(), 'Queue should be empty initially');

  queue.enqueue(10);
  queue.enqueue(20);
  queue.enqueue(30);

  console.assert(queue.peek() === 10, 'Peek should return 10');
  console.assert(queue.dequeue() === 10, 'Dequeue should return 10');
  console.assert(queue.peek() === 20, 'Peek after dequeue should return 20');
  console.assert(!queue.isEmpty(), 'Queue should not be empty');

  queue.dequeue();
  queue.dequeue();

  console.assert(queue.isEmpty(), 'Queue should be empty after dequeuing all elements');
  console.assert(queue.dequeue() === null, 'Dequeue from empty queue should return null');

  console.log('All Queue tests passed!');
}
