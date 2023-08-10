export class SegmentTree {
  private tree: number[];
  private n: number;

  constructor(arr: number[]) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n).fill(0);
    this.build(arr, 0, 0, this.n - 1);
  }

  private build(arr: number[], node: number, start: number, end: number): void {
    if (start === end) {
      this.tree[node] = arr[start];
    } else {
      const mid = Math.floor((start + end) / 2);
      this.build(arr, 2 * node + 1, start, mid);
      this.build(arr, 2 * node + 2, mid + 1, end);
      this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
    }
  }

  public query(left: number, right: number): number {
    return this._query(0, 0, this.n - 1, left, right);
  }

  private _query(node: number, start: number, end: number, left: number, right: number): number {
    if (right < start || end < left) return 0;
    if (left <= start && end <= right) return this.tree[node];
    const mid = Math.floor((start + end) / 2);
    return (
      this._query(2 * node + 1, start, mid, left, right) +
      this._query(2 * node + 2, mid + 1, end, left, right)
    );
  }

  public update(index: number, value: number): void {
    this._update(0, 0, this.n - 1, index, value);
  }

  private _update(node: number, start: number, end: number, index: number, value: number): void {
    if (start === end) {
      this.tree[node] = value;
    } else {
      const mid = Math.floor((start + end) / 2);
      if (start <= index && index <= mid) this._update(2 * node + 1, start, mid, index, value);
      else this._update(2 * node + 2, mid + 1, end, index, value);
      this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
    }
  }
}
