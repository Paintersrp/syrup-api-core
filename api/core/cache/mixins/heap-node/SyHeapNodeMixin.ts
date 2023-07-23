import { CacheInterface } from '../../SyCache';

export class HeapNode<T> {
  key: string;
  item: CacheInterface<T>;

  constructor(key: string, item: CacheInterface<T>) {
    this.key = key;
    this.item = item;
  }
}
