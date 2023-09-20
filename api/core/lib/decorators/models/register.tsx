import 'reflect-metadata';

export function Register(target: any) {
  Reflect.defineMetadata('registered', true, target);
}
