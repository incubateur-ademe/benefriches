import { type ClassValue as ClsxClassValue, clsx } from "clsx";

function classNames(...args: ClassValue[]) {
  return clsx(args);
}

export type ClassValue = ClsxClassValue;

export default classNames;
