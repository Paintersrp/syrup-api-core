import 'reflect-metadata';

function getParamNames(func: Function) {
  const fnStr = func.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm, '');
  const result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
  return result === null ? [] : result;
}

export function Validate(
  target: Object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
  const paramNames = getParamNames(originalMethod);

  descriptor.value = function (...args: any[]) {
    for (let i = 0; i < paramTypes.length; i++) {
      if (typeof args[i] !== paramTypes[i].name.toLowerCase()) {
        throw new TypeError(
          `Argument "${paramNames[i]}" at index ${i} is not of type ${paramTypes[
            i
          ].name.toLowerCase()} for function ${String(propertyKey)}. Received ${typeof args[
            i
          ]}, value: ${args[i]}`
        );
      }
    }
    return originalMethod.apply(this, args);
  };
}
