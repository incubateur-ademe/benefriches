export function typedObjectEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}
