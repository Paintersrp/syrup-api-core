export function Mixin(...mixins: Function[]) {
  return function (constructor: Function) {
    Object.assign(constructor.prototype, ...mixins);
  };
}
