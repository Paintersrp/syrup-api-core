import { EventEmitter } from '../../../../mixins/events/EventEmitter';
import { ListItem } from './ListItem';

/**
 * Represents a doubly linked list of ListItem nodes with a head and tail.
 */
export class DoublyLinkedList {
  public head: ListItem; // The head of the linked list
  public tail: ListItem; // The tail of the linked list
  private events: EventEmitter;

  /**
   * Creates a new DoublyLinkedList.
   * Initializes the head and tail nodes to a default ListItem.
   */
  constructor() {
    this.head = new ListItem({ key: 0, value: 0, frequency: 0 });
    this.tail = new ListItem({ key: 0, value: 0, frequency: 0 });

    // Initially, the head node's next is the tail node and the tail node's prev is the head node
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.events = new EventEmitter();
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
    this.events.emit('nodeInserted', node);
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

    this.events.emit('nodeRemoved', node);
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

  /**
   * Iterator generator for the DoublyLinkedList.
   *
   * @returns {Generator<ListItem>} A generator that yields each node in the list in forward order.
   */
  public *iterator(): Generator<ListItem> {
    let node: ListItem | null = this.head;
    while (node != null) {
      yield node;
      node = node.next;
    }
  }

  /**
   * Reverse iterator generator for the DoublyLinkedList.
   *
   * @returns {Generator<ListItem>} A generator that yields each node in the list in reverse order.
   */
  public *reverseIterator(): Generator<ListItem> {
    let node: ListItem | null = this.tail;
    while (node != null) {
      yield node;
      node = node.prev;
    }
  }

  /**
   * Serializes the DoublyLinkedList into a JSON string.
   *
   * @returns {string} A JSON string representation of the DoublyLinkedList.
   */
  public serialize(): string {
    const nodes: ListItem[] = [];
    for (let node of this.iterator()) {
      nodes.push(node);
    }
    return JSON.stringify(nodes);
  }

  /**
   * Deserializes a JSON string into a DoublyLinkedList.
   *
   * @param {string} serializedList - A JSON string representation of a DoublyLinkedList.
   * @returns {DoublyLinkedList} A new DoublyLinkedList populated with the ListItems from the parsed JSON string.
   */
  static deserialize(serializedList: string): DoublyLinkedList {
    const nodes: ListItem[] = JSON.parse(serializedList);
    const list = new DoublyLinkedList();
    for (let node of nodes) {
      list.insertAtHead(node);
    }
    return list;
  }
}
