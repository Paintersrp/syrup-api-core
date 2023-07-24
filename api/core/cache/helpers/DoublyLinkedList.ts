import { ListItem } from './ListItem';

/**
 * @todo ?
 */

/**
 * Represents a doubly linked list of ListItem nodes with a head and tail.
 * Supports inserting at the head, removing a node, and removing from the tail.
 */
export class DoublyLinkedList {
  public head: ListItem; // The head of the linked list
  public tail: ListItem; // The tail of the linked list

  /**
   * Creates a new DoublyLinkedList.
   * Initializes the head and tail nodes to a default ListItem.
   */
  constructor() {
    this.head = new ListItem(0, 0, 0);
    this.tail = new ListItem(0, 0, 0);

    // Initially, the head node's next is the tail node and the tail node's prev is the head node
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * Inserts a new ListItem node at the head of the DoublyLinkedList.
   *
   * @param {ListItem} node - The node to be inserted at the head.
   */
  public insertAtHead(node: ListItem): void {
    node.next = this.head.next;

    this.head.next!.prev = node;
    this.head.next = node;

    node.prev = this.head;
  }

  /**
   * Removes a ListItem node from the DoublyLinkedList.
   *
   * @param {ListItem} node - The node to be removed.
   */
  public removeNode(node: ListItem): void {
    let prevNode = node.prev;
    let nextNode = node.next;

    // Remove the node by connecting its prev node and next node
    if (prevNode) {
      prevNode.next = nextNode;
    }

    if (nextNode) {
      nextNode.prev = prevNode;
    }
  }

  /**
   * Removes and returns the tail node from the DoublyLinkedList.
   *
   * @returns {ListItem} The removed tail node.
   */
  public removeTail(): ListItem {
    let tailNode = this.tail.prev!;
    this.removeNode(tailNode);

    return tailNode;
  }
}
