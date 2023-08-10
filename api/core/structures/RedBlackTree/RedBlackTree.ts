export enum RBTColor {
  RED,
  BLACK,
}

export class RBTNode<T> {
  constructor(
    public value: T,
    public color: RBTColor = RBTColor.RED,
    public left: RBTNode<T> | null = null,
    public right: RBTNode<T> | null = null
  ) {}
}

export class RedBlackTree<T> {
  public root: RBTNode<T> | null = null;

  private isRed(node: RBTNode<T> | null): boolean {
    return node !== null && node.color === RBTColor.RED;
  }

  private rotateLeft(x: RBTNode<T>): RBTNode<T> {
    const y = x.right!;
    x.right = y.left;
    y.left = x;
    y.color = x.color;
    x.color = RBTColor.RED;
    return y;
  }

  private rotateRight(y: RBTNode<T>): RBTNode<T> {
    const x = y.left!;
    y.left = x.right;
    x.right = y;
    x.color = y.color;
    y.color = RBTColor.RED;
    return x;
  }

  private flipColors(node: RBTNode<T>): void {
    node.color = node.color === RBTColor.RED ? RBTColor.BLACK : RBTColor.RED;
    node.left!.color = node.left!.color === RBTColor.RED ? RBTColor.BLACK : RBTColor.RED;
    node.right!.color = node.right!.color === RBTColor.RED ? RBTColor.BLACK : RBTColor.RED;
  }

  private moveRedLeft(node: RBTNode<T>): RBTNode<T> {
    this.flipColors(node);
    if (this.isRed(node.right!.left)) {
      node.right = this.rotateRight(node.right!);
      node = this.rotateLeft(node);
      this.flipColors(node);
    }
    return node;
  }

  private moveRedRight(node: RBTNode<T>): RBTNode<T> {
    this.flipColors(node);
    if (this.isRed(node.left!.left)) {
      node = this.rotateRight(node);
      this.flipColors(node);
    }
    return node;
  }

  private balance(node: RBTNode<T>): RBTNode<T> {
    if (this.isRed(node.right)) node = this.rotateLeft(node);
    if (node.left && this.isRed(node.left) && this.isRed(node.left.left))
      node = this.rotateRight(node);
    if (this.isRed(node.left) && this.isRed(node.right)) this.flipColors(node);
    return node;
  }

  public insert(value: T): void {
    this.root = this._insert(this.root, value);
    this.root.color = RBTColor.BLACK;
  }

  private _insert(node: RBTNode<T> | null, value: T): RBTNode<T> {
    if (node === null) return new RBTNode(value);

    if (value < node.value) node.left = this._insert(node.left, value);
    else if (value > node.value) node.right = this._insert(node.right, value);

    if (this.isRed(node.right) && !this.isRed(node.left)) node = this.rotateLeft(node);
    if (node.left && this.isRed(node.left) && this.isRed(node.left.left))
      node = this.rotateRight(node);
    if (this.isRed(node.left) && this.isRed(node.right)) this.flipColors(node);

    return node;
  }

  public search(value: T): boolean {
    return this._search(this.root, value) !== null;
  }

  private _search(node: RBTNode<T> | null, value: T): RBTNode<T> | null {
    if (node === null) return null;
    if (value < node.value) return this._search(node.left, value);
    if (value > node.value) return this._search(node.right, value);
    return node;
  }

  public delete(value: T): void {
    if (!this.search(value)) return;
    if (!this.isRed(this.root!.left) && !this.isRed(this.root!.right))
      this.root!.color = RBTColor.RED;
    this.root = this._delete(this.root, value);
    if (this.root) this.root.color = RBTColor.BLACK;
  }

  private _delete(node: RBTNode<T> | null, value: T): RBTNode<T> | null {
    if (value < node!.value) {
      if (!this.isRed(node!.left) && !this.isRed(node!.left!.left)) node = this.moveRedLeft(node!);
      node!.left = this._delete(node!.left, value);
    } else {
      if (this.isRed(node!.left)) node = this.rotateRight(node!);
      if (value === node!.value && node!.right === null) return null;
      if (!this.isRed(node!.right) && !this.isRed(node!.right!.left))
        node = this.moveRedRight(node!);
      if (value === node!.value) {
        const minNode = this.min(node!.right!);
        node!.value = minNode.value;
        node!.right = this.deleteMin(node!.right!);
      } else {
        node!.right = this._delete(node!.right, value);
      }
    }
    return this.balance(node!);
  }

  private deleteMin(node: RBTNode<T>): RBTNode<T> | null {
    if (node.left === null) return null;
    if (!this.isRed(node.left) && !this.isRed(node.left.left)) node = this.moveRedLeft(node);
    node.left = this.deleteMin(node.left!);
    return this.balance(node);
  }

  private min(node: RBTNode<T>): RBTNode<T> {
    let current = node;
    while (current.left) current = current.left;
    return current;
  }
}
