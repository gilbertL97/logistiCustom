import { Request } from "express";

export function CurrentDevice() {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (req: Request, ...args: any[]) {
      return originalMethod.call(this, req, ...args);
    };
    return descriptor;
  };
}

export function Public() {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    Object.defineProperty(target, propertyKey, {
      ...descriptor,
      value: descriptor.value,
    });
  };
}