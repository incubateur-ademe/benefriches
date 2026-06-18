import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  convertHectaresToSquareMeters,
  convertSquareMetersToHectares,
  surfaceAreaSchema,
} from "./surfaceArea.js";

describe("Surface area conversion", () => {
  it("converts square meters to hectares", () => {
    assert.strictEqual(convertSquareMetersToHectares(13000), 1.3);
  });
  it("converts hectares to square meters", () => {
    assert.strictEqual(convertHectaresToSquareMeters(15), 150000);
  });
});

describe("surfaceAreaSchema", () => {
  it("accepts zero", () => {
    // Arrange
    const input = 0;

    // Act
    const result = surfaceAreaSchema.safeParse(input);

    // Assert
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.data, 0);
  });

  it("accepts positive numbers", () => {
    // Arrange
    const input = 1500.5;

    // Act
    const result = surfaceAreaSchema.safeParse(input);

    // Assert
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.data, 1500.5);
  });

  it("rejects negative numbers", () => {
    // Arrange
    const input = -1;

    // Act
    const result = surfaceAreaSchema.safeParse(input);

    // Assert
    assert.strictEqual(result.success, false);
  });

  it("rejects non-number values", () => {
    // Arrange
    const input = "100";

    // Act
    const result = surfaceAreaSchema.safeParse(input);

    // Assert
    assert.strictEqual(result.success, false);
  });
});
