type Constructable = new (...args: any[]) => {};

function Mix(...mixins: Constructable[]) {
  return mixins.reduce(
    (c, mixin) =>
      class extends c {
        constructor(...args: any[]) {
          super(...args);
        }
      },
    class {}
  );
}
