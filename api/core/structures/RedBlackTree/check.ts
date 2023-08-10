import { RBTColor, RBTNode, RedBlackTree } from './RedBlackTree';

export function testRedBlackTree() {
  const tree = new RedBlackTree<number>();

  // Test Insertion
  const values = [20, 15, 25, 10, 5, 1];
  values.forEach((value) => tree.insert(value));

  // Test Binary Search Tree Property
  if (!isBST(tree)) {
    console.error('The tree does not satisfy the BST property!');
    return;
  }

  // Test Red-Black Properties
  if (!isRedBlackTree(tree)) {
    console.error('The tree does not satisfy the Red-Black properties!');
    return;
  }

  // Test Deletion
  tree.delete(15);
  if (!isBST(tree) || !isRedBlackTree(tree)) {
    console.error('Deletion failed to maintain properties!');
    return;
  }

  console.log('All Red Black Tree tests passed!');
}

function isBST<T>(tree: RedBlackTree<T>): boolean {
  return isBSTUtil(tree.root, null, null);
}

function isBSTUtil<T>(node: RBTNode<T> | null, minValue: T | null, maxValue: T | null): boolean {
  if (node === null) return true;

  if (
    (minValue !== null && node.value <= minValue!) ||
    (maxValue !== null && node.value >= maxValue!)
  )
    return false;

  return isBSTUtil(node.left, minValue, node.value) && isBSTUtil(node.right, node.value, maxValue);
}

function isRedBlackTree<T>(tree: RedBlackTree<T>): boolean {
  // Root must be black
  if (tree.root?.color !== RBTColor.BLACK) return false;

  // No two consecutive red nodes
  if (!noConsecutiveRedNodes(tree.root)) return false;

  // Black height must be the same for all paths
  const blackHeight = getBlackHeight(tree.root);
  if (blackHeight === -1) return false;

  return true;
}

function noConsecutiveRedNodes<T>(node: RBTNode<T> | null): boolean {
  if (node === null) return true;
  if (
    node.color === RBTColor.RED &&
    (node.left?.color === RBTColor.RED || node.right?.color === RBTColor.RED)
  )
    return false;
  return noConsecutiveRedNodes(node.left) && noConsecutiveRedNodes(node.right);
}

function getBlackHeight<T>(node: RBTNode<T> | null): number {
  if (node === null) return 0;

  const leftBlackHeight = getBlackHeight(node.left);
  const rightBlackHeight = getBlackHeight(node.right);

  if (leftBlackHeight === -1 || rightBlackHeight === -1 || leftBlackHeight !== rightBlackHeight)
    return -1;

  return leftBlackHeight + (node.color === RBTColor.BLACK ? 1 : 0);
}

testRedBlackTree();
