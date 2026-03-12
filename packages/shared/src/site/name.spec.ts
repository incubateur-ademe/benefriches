import { generateSiteName } from "./name";

describe("Site name generation", () => {
  it("should generate 'Exploitation agricole de Blajan'", () => {
    expect(
      generateSiteName({
        nature: "AGRICULTURAL_OPERATION",
        cityName: "Blajan",
      }),
    ).toEqual("Exploitation agricole de Blajan");
  });

  it("should generate 'Espace naturel de Fontainebleau'", () => {
    expect(
      generateSiteName({
        nature: "NATURAL_AREA",
        cityName: "Fontainebleau",
      }),
    ).toEqual("Espace naturel de Fontainebleau");
  });

  it("should generate 'Forêt de Fontainebleau'", () => {
    expect(
      generateSiteName({
        nature: "NATURAL_AREA",
        naturalAreaType: "FOREST",
        cityName: "Fontainebleau",
      }),
    ).toEqual("Forêt de Fontainebleau");
  });

  it("should generate 'Friche industrielle de Blajan'", () => {
    expect(
      generateSiteName({
        fricheActivity: "INDUSTRY",
        nature: "FRICHE",
        cityName: "Blajan",
      }),
    ).toEqual("Friche industrielle de Blajan");
  });

  it("should generate 'Friche industrielle d'Angers'", () => {
    expect(
      generateSiteName({
        nature: "FRICHE",
        fricheActivity: "INDUSTRY",
        cityName: "Angers",
      }),
    ).toEqual("Friche industrielle d'Angers");
  });

  it("should generate 'Friche du Mans'", () => {
    expect(
      generateSiteName({
        fricheActivity: "OTHER",
        nature: "FRICHE",
        cityName: "Le Mans",
      }),
    ).toEqual("Friche du Mans");
  });

  it("should generate 'Zone urbaine de Chartres' when no urban zone type provided", () => {
    expect(
      generateSiteName({
        nature: "URBAN_ZONE",
        cityName: "Chartres",
      }),
    ).toEqual("Zone urbaine de Chartres");
  });

  it("should generate 'Zone d'activités économiques de Chartres' for economic activity zone", () => {
    expect(
      generateSiteName({
        nature: "URBAN_ZONE",
        urbanZone: "ECONOMIC_ACTIVITY_ZONE",
        cityName: "Chartres",
      }),
    ).toEqual("Zone d'activités économiques de Chartres");
  });

  it("should generate 'Zone d'habitation d'Angers' for residential zone", () => {
    expect(
      generateSiteName({
        nature: "URBAN_ZONE",
        urbanZone: "RESIDENTIAL_ZONE",
        cityName: "Angers",
      }),
    ).toEqual("Zone d'habitation d'Angers");
  });
});
