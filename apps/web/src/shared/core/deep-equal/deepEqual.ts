function deepEqual<T>(a: T, b: T): boolean {
  if (a === b) return true;

  if (a == null || b == null) return false;

  if (typeof a !== "object" || typeof b !== "object") return false;

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!(key in objB)) return false;
    if (!deepEqual(objA[key], objB[key])) return false;
  }

  return true;
}

export default deepEqual;
