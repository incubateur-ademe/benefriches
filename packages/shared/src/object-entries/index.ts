export function typedObjectEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
    return Object.entries(obj) as [keyof T, T[keyof T]][];
  }
  