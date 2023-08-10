import { Stack } from './Stack';

export function testStack() {
  const stack = new Stack<number>();

  console.assert(stack.isEmpty(), 'Stack should be empty initially');

  stack.push(10);
  stack.push(20);
  stack.push(30);

  console.assert(stack.peek() === 30, 'Peek should return 30');
  console.assert(stack.pop() === 30, 'Pop should return 30');
  console.assert(stack.peek() === 20, 'Peek after pop should return 20');
  console.assert(!stack.isEmpty(), 'Stack should not be empty');

  stack.pop();
  stack.pop();

  console.assert(stack.isEmpty(), 'Stack should be empty after popping all elements');
  console.assert(stack.pop() === null, 'Pop from empty stack should return null');

  console.log('All Stack tests passed!');
}

testStack();
