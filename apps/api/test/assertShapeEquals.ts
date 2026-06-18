import assert from "node:assert/strict";

/**
 * Asserts that `actual` matches `expected` EXACTLY — extra or missing keys fail — except for
 * the keys named in `dynamicMatchers`, whose values are non-deterministic (timestamps,
 * generated ids, …) and are validated by a predicate instead of by value.
 *
 * This is the node:assert equivalent of Vitest's
 * `expect(actual).toEqual({ ...expected, created_at: expect.any(Date) })`. Unlike
 * `assert.partialDeepStrictEqual`, it preserves the exhaustive-shape guarantee: an unexpected
 * extra column makes the assertion fail.
 */
export const assertShapeEquals = <T extends Record<string, unknown>>(
  actual: T,
  expected: Record<string, unknown>,
  dynamicMatchers: Partial<Record<keyof T, (value: unknown) => boolean>> = {},
): void => {
  for (const key of Object.keys(dynamicMatchers)) {
    const matches = dynamicMatchers[key as keyof T];
    assert.ok(
      matches?.(actual[key]),
      `dynamic field "${key}" did not match its predicate (received: ${String(actual[key])})`,
    );
  }

  const dynamicKeys = new Set(Object.keys(dynamicMatchers));
  const staticEntries = Object.entries(actual).filter(([key]) => !dynamicKeys.has(key));

  assert.deepStrictEqual(Object.fromEntries(staticEntries), expected);
};

/** Predicate: the value is a `Date` instance (e.g. a Knex-returned timestamp column). */
export const isDate = (value: unknown): boolean => value instanceof Date;

/** Predicate: the value is a number (e.g. a computed cost field). */
export const isNumber = (value: unknown): boolean => typeof value === "number";
