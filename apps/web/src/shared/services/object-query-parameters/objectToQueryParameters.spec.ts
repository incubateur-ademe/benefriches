import { objectToQueryParams } from "./objectToQueryParameters";

import { SoilType } from "@/features/create-site/domain/siteFoncier.types";

describe("objectToQueryParams", () => {
  it('should return cityCode=75011 for { cityCode: "75011" }', () => {
    const input = { cityCode: "75011" };
    const expectedOutput = "cityCode=75011";

    expect(objectToQueryParams(input)).toEqual(expectedOutput);
  });

  it("should return hasContaminatedSoils=true for { hasContaminatedSoils: true }", () => {
    const input = { hasContaminatedSoils: true };
    const expectedOutput = "hasContaminatedSoils=true";

    expect(objectToQueryParams(input)).toEqual(expectedOutput);
  });

  it('should return soils[0]=BUILDINGS&soils[1]=MINERAL_SOIL&soils[2]=PRAIRIE for { soils: ["BUILDINGS", "MINERAL_SOIL", "PRAIRIE"] }', () => {
    const input = {
      soils: ["BUILDINGS", "MINERAL_SOIL", "PRAIRIE"],
    };
    const expectedOutput = encodeURI(
      "soils[0]=BUILDINGS&soils[1]=MINERAL_SOIL&soils[2]=PRAIRIE",
    );

    expect(objectToQueryParams(input)).toEqual(expectedOutput);
  });

  it("should handle array of objects", () => {
    const input = {
      soils: [
        { surfaceArea: 1500, type: SoilType.CULTIVATION },
        { surfaceArea: 30000, type: SoilType.FOREST_DECIDUOUS },
      ],
    };
    const expectedOutput = encodeURI(
      "soils[0][surfaceArea]=1500&soils[0][type]=CULTIVATION&soils[1][surfaceArea]=30000&soils[1][type]=FOREST_DECIDUOUS",
    );

    expect(objectToQueryParams(input)).toEqual(expectedOutput);
  });

  it("should handle mix of simple values, array of values and array of objects", () => {
    const input = {
      cityCode: "75011",
      expenses: [2000, 150],
      soils: [
        { surfaceArea: 1500, type: SoilType.CULTIVATION },
        { surfaceArea: 30000, type: SoilType.FOREST_DECIDUOUS },
      ],
    };
    const expectedOutput = encodeURI(
      "cityCode=75011&expenses[0]=2000&expenses[1]=150&soils[0][surfaceArea]=1500&soils[0][type]=CULTIVATION&soils[1][surfaceArea]=30000&soils[1][type]=FOREST_DECIDUOUS",
    );

    expect(objectToQueryParams(input)).toEqual(expectedOutput);
  });
});
