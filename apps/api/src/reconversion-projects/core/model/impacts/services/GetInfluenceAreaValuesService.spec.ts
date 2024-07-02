import { GetInfluenceAreaValuesService } from "./GetInfluenceAreaValuesService";

describe("GetInfluenceAreaValuesService", () => {
  let getInfluenceAreaValuesService: GetInfluenceAreaValuesService;

  beforeAll(() => {
    getInfluenceAreaValuesService = new GetInfluenceAreaValuesService(10000, 6000000000, 300000);
  });

  it("returns municipal density of 50 hab/km²", () => {
    expect(
      getInfluenceAreaValuesService.municipalDensityInhabitantPerSquareMeter * 1000000,
    ).toEqual(50);
  });

  it("returns 1600 houses per square kilometer for the city", () => {
    expect(getInfluenceAreaValuesService.cityHousingPerSquareMeter * 1000000).toEqual(1600);
  });

  it("returns an influence area of 972644 m²", () => {
    expect(getInfluenceAreaValuesService.getInfluenceSquareMetersArea()).toBeCloseTo(962643.55);
  });

  it("returns an housing surface of 1556 m² in influence area", () => {
    expect(getInfluenceAreaValuesService.getInfluenceAreaSquareMetersHousingSurface()).toBeCloseTo(
      1540.23,
    );
  });

  it("computes inhabitants from housing surface", () => {
    expect(getInfluenceAreaValuesService.getInhabitantsFromHousingSurface(50000)).toBeCloseTo(
      1562.5,
    );
  });

  it("computes households from housing surface", () => {
    expect(getInfluenceAreaValuesService.getHouseholdsFromHousingSurface(50000)).toBeCloseTo(
      710.227272727,
    );
  });

  it("computes influence area with influence radius", () => {
    getInfluenceAreaValuesService.influenceRadius = 100;
    expect(getInfluenceAreaValuesService.getInfluenceSquareMetersArea()).toBeCloseTo(66865);
    expect(getInfluenceAreaValuesService.getInfluenceAreaSquareMetersHousingSurface()).toBeCloseTo(
      106.984,
    );
  });
});
