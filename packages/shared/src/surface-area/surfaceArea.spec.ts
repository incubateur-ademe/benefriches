import {
  convertHectaresToSquareMeters,
  convertSquareMetersToHectares,
  surfaceAreaSchema,
} from "./surfaceArea";

describe("Surface area conversion", () => {
  it("converts square meters to hectares", () => {
    expect(convertSquareMetersToHectares(13000)).toEqual(1.3);
  });
  it("converts hectares to square meters", () => {
    expect(convertHectaresToSquareMeters(15)).toEqual(150000);
  });
});

describe("surfaceAreaSchema", () => {
  it("accepts zero", () => {
    // Arrange
    const input = 0;

    // Act
    const result = surfaceAreaSchema.safeParse(input);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toBe(0);
  });

  it("accepts positive numbers", () => {
    // Arrange
    const input = 1500.5;

    // Act
    const result = surfaceAreaSchema.safeParse(input);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toBe(1500.5);
  });

  it("rejects negative numbers", () => {
    // Arrange
    const input = -1;

    // Act
    const result = surfaceAreaSchema.safeParse(input);

    // Assert
    expect(result.success).toBe(false);
  });

  it("rejects non-number values", () => {
    // Arrange
    const input = "100";

    // Act
    const result = surfaceAreaSchema.safeParse(input);

    // Assert
    expect(result.success).toBe(false);
  });
});
