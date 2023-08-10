export class FenwickTree {
  private tree: number[];
  private n: number;

  constructor(arr: number[]) {
    this.n = arr.length;
    this.tree = new Array(this.n + 1).fill(0);
    for (let i = 0; i < this.n; i++) {
      this.update(i, arr[i]);
    }
  }

  public update(index: number, value: number): void {
    for (let i = index + 1; i <= this.n; i += i & -i) {
      this.tree[i] += value;
    }
  }

  public query(index: number): number {
    let sum = 0;
    for (let i = index + 1; i > 0; i -= i & -i) {
      sum += this.tree[i];
    }
    return sum;
  }

  public rangeQuery(left: number, right: number): number {
    return this.query(right) - this.query(left - 1);
  }
}
