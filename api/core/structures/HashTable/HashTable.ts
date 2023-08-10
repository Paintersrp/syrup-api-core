export class HashTable<K extends { toString(): string }, V> {
  private table: Array<Array<[K, V]>> = [];
  private size: number = 0;
  private capacity: number;

  constructor(capacity: number = 16) {
    this.capacity = capacity;
    this.table = new Array(capacity).fill(null);
  }

  private hash(key: K): number {
    let hash = 5381;
    const str = key.toString();
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) + hash + str.charCodeAt(i);
    }
    return hash % this.capacity;
  }

  private resize(): void {
    const oldTable = this.table;
    this.capacity *= 2;
    this.size = 0;
    this.table = new Array(this.capacity).fill(null);

    for (const chain of oldTable) {
      if (chain) {
        for (const [key, value] of chain) {
          this.put(key, value);
        }
      }
    }
  }

  public put(key: K, value: V): void {
    if (this.size / this.capacity > 0.75) {
      this.resize();
    }
    const index = this.hash(key);
    if (!this.table[index]) {
      this.table[index] = [];
    }
    this.table[index].push([key, value]);
    this.size++;
  }

  public get(key: K): V | undefined {
    const index = this.hash(key);
    const chain = this.table[index];
    if (chain) {
      for (const [k, v] of chain) {
        if (k === key) return v;
      }
    }
    return undefined;
  }

  public remove(key: K): void {
    const index = this.hash(key);
    const chain = this.table[index];
    if (chain) {
      let removed = false;
      for (let i = 0; i < chain.length; i++) {
        if (chain[i][0] === key) {
          chain.splice(i, 1);
          this.size--;
          removed = true;
          break;
        }
      }
      if (removed && chain.length === 0) {
        delete this.table[index];
      }
    }
  }

  public print(): void {
    for (const [index, chain] of this.table.entries()) {
      if (chain) {
        console.log(`Index ${index}:`, chain.map(([k, v]) => `(${k}, ${v})`).join(' -> '));
      }
    }
  }

  public getSize(): number {
    return this.size;
  }
}
