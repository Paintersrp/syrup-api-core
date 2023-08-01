import memoize from 'lodash';

export function Memoize(_: any, __: string, descriptor: PropertyDescriptor) {
  descriptor.value = memoize(descriptor.value);
}
