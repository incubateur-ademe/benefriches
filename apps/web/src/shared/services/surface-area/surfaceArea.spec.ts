import { convertHectaresToSquareMeters, convertSquareMetersToHectares } from "./surfaceArea";

describe("Surface Area service", () => {
  it("converts square meters to hectares", () => {
    expect(convertSquareMetersToHectares(13000)).toEqual(1.3);
  });
  it("converts hectares to square meters", () => {
    expect(convertHectaresToSquareMeters(15)).toEqual(150000);
  });
});
