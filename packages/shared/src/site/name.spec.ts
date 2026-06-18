import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { generateSiteName } from "./name.js";

describe("Site name generation", () => {
  it("should generate 'Exploitation agricole de Blajan'", () => {
    assert.strictEqual(
      generateSiteName({
        nature: "AGRICULTURAL_OPERATION",
        cityName: "Blajan",
      }),
      "Exploitation agricole de Blajan",
    );
  });

  it("should generate 'Espace naturel de Fontainebleau'", () => {
    assert.strictEqual(
      generateSiteName({
        nature: "NATURAL_AREA",
        cityName: "Fontainebleau",
      }),
      "Espace naturel de Fontainebleau",
    );
  });

  it("should generate 'Forêt de Fontainebleau'", () => {
    assert.strictEqual(
      generateSiteName({
        nature: "NATURAL_AREA",
        naturalAreaType: "FOREST",
        cityName: "Fontainebleau",
      }),
      "Forêt de Fontainebleau",
    );
  });

  it("should generate 'Friche industrielle de Blajan'", () => {
    assert.strictEqual(
      generateSiteName({
        fricheActivity: "INDUSTRY",
        nature: "FRICHE",
        cityName: "Blajan",
      }),
      "Friche industrielle de Blajan",
    );
  });

  it("should generate 'Friche industrielle d'Angers'", () => {
    assert.strictEqual(
      generateSiteName({
        nature: "FRICHE",
        fricheActivity: "INDUSTRY",
        cityName: "Angers",
      }),
      "Friche industrielle d'Angers",
    );
  });

  it("should generate 'Friche du Mans'", () => {
    assert.strictEqual(
      generateSiteName({
        fricheActivity: "OTHER",
        nature: "FRICHE",
        cityName: "Le Mans",
      }),
      "Friche du Mans",
    );
  });

  it("should generate 'Zone urbaine de Chartres' when no urban zone type provided", () => {
    assert.strictEqual(
      generateSiteName({
        nature: "URBAN_ZONE",
        cityName: "Chartres",
      }),
      "Zone urbaine de Chartres",
    );
  });

  it("should generate 'Zone d'activités économiques de Chartres' for economic activity zone", () => {
    assert.strictEqual(
      generateSiteName({
        nature: "URBAN_ZONE",
        urbanZone: "ECONOMIC_ACTIVITY_ZONE",
        cityName: "Chartres",
      }),
      "Zone d'activités économiques de Chartres",
    );
  });

  it("should generate 'Zone d'habitation d'Angers' for residential zone", () => {
    assert.strictEqual(
      generateSiteName({
        nature: "URBAN_ZONE",
        urbanZone: "RESIDENTIAL_ZONE",
        cityName: "Angers",
      }),
      "Zone d'habitation d'Angers",
    );
  });
});
