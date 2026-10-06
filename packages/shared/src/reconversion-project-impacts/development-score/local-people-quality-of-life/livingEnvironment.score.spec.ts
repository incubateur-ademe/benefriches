import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getLivingEnvironmentScore } from "./livingEnvironment.score";

describe("livingEnvironment score", () => {
  it(`returns A grade for friche reconversion with new green soils`, () => {
    const result = getLivingEnvironmentScore({
      siteNature: "FRICHE",
      projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
      siteReconversionType: "friche",
      buildingsFloorAreaDistribution: undefined,
      soilEvolutionDetails: { newGreenSoilSurfaces: 5400 },
    });
    assert.strictEqual(result?.letterGrade, "A");
    assert.strictEqual(result?.metrics.siteReconversionType, "friche");
  });

  it(`returns A grade for friche reconversion new amenities created`, () => {
    const result = getLivingEnvironmentScore({
      siteNature: "FRICHE",
      projectDevelopmentPlanType: "URBAN_PROJECT",
      siteReconversionType: "friche",
      buildingsFloorAreaDistribution: { CINEMA: 5000 },
      soilEvolutionDetails: { newGreenSoilSurfaces: 0 },
    });
    assert.strictEqual(result?.letterGrade, "A");
    assert.strictEqual(result?.metrics.buildingsFloorAreaDistribution?.CINEMA, 5000);
  });

  it(`returns A grade for GRAND ENSEMBLE and new green space surfaces`, () => {
    const result = getLivingEnvironmentScore({
      siteNature: "URBAN_ZONE",
      projectDevelopmentPlanType: "GRAND_ENSEMBLE",
      siteReconversionType: "friche",
      buildingsFloorAreaDistribution: undefined,
      soilEvolutionDetails: { newGreenSoilSurfaces: 5000 },
    });
    assert.strictEqual(result?.letterGrade, "A");
    assert.strictEqual(result?.metrics.siteNature, "URBAN_ZONE");
  });

  it(`returns A grade for GRAND ENSEMBLE and new amenities created`, () => {
    const result = getLivingEnvironmentScore({
      siteNature: "FRICHE",
      projectDevelopmentPlanType: "GRAND_ENSEMBLE",
      siteReconversionType: "friche",
      buildingsFloorAreaDistribution: { CINEMA: 5000, MEDICAL_SOCIAL_FACILITY: 2000 },
      soilEvolutionDetails: { newGreenSoilSurfaces: 5000 },
    });
    assert.strictEqual(result?.letterGrade, "A");
    assert.strictEqual(result?.metrics.projectDevelopmentPlanType, "GRAND_ENSEMBLE");
  });

  it(`returns B grade for friche reconversion`, () => {
    const result = getLivingEnvironmentScore({
      siteNature: "FRICHE",
      projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
      siteReconversionType: "friche",
      buildingsFloorAreaDistribution: undefined,
      soilEvolutionDetails: { newGreenSoilSurfaces: 0 },
    });
    assert.strictEqual(result?.letterGrade, "B");
    assert.strictEqual(result?.metrics.siteReconversionType, "friche");
  });

  it(`returns B grade for GRAND ENSEMBLE`, () => {
    const result = getLivingEnvironmentScore({
      siteNature: "FRICHE",
      projectDevelopmentPlanType: "GRAND_ENSEMBLE",
      siteReconversionType: "friche",
      buildingsFloorAreaDistribution: undefined,
      soilEvolutionDetails: { newGreenSoilSurfaces: 0 },
    });
    assert.strictEqual(result?.letterGrade, "B");
    assert.strictEqual(result?.metrics.projectDevelopmentPlanType, "GRAND_ENSEMBLE");
  });

  it(`returns B grade for project with new green soils`, () => {
    const result = getLivingEnvironmentScore({
      siteNature: "URBAN_ZONE",
      projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
      siteReconversionType: undefined,
      buildingsFloorAreaDistribution: undefined,
      soilEvolutionDetails: { newGreenSoilSurfaces: 5000 },
    });
    assert.strictEqual(result?.letterGrade, "B");
    assert.strictEqual(result?.metrics.soilEvolutionDetails.newGreenSoilSurfaces, 5000);
  });

  it(`returns B grade for project with new amenities`, () => {
    const result = getLivingEnvironmentScore({
      siteNature: "URBAN_ZONE",
      projectDevelopmentPlanType: "URBAN_PROJECT",
      siteReconversionType: undefined,
      buildingsFloorAreaDistribution: { LOCAL_STORE: 5000, LOCAL_SERVICES: 2000 },
      soilEvolutionDetails: { newGreenSoilSurfaces: 0 },
    });
    assert.strictEqual(result?.letterGrade, "B");
    assert.strictEqual(result?.metrics.buildingsFloorAreaDistribution?.LOCAL_STORE, 5000);
    assert.strictEqual(result?.metrics.buildingsFloorAreaDistribution?.LOCAL_SERVICES, 2000);
  });

  it(`returns C grade for ZAE reconversion projet`, () => {
    const result = getLivingEnvironmentScore({
      siteNature: "URBAN_ZONE",
      projectDevelopmentPlanType: "ZAE_TRANSFORMATION",
      siteReconversionType: undefined,
      buildingsFloorAreaDistribution: { OFFICES: 5000 },
      soilEvolutionDetails: { newGreenSoilSurfaces: 0 },
    });
    assert.strictEqual(result?.letterGrade, "C");
  });

  it(`returns C grade for SUBURBAN_DENSIFICATION projet with new green soils`, () => {
    const result = getLivingEnvironmentScore({
      siteNature: "URBAN_ZONE",
      projectDevelopmentPlanType: "SUBURBAN_DENSIFICATION",
      siteReconversionType: undefined,
      buildingsFloorAreaDistribution: undefined,
      soilEvolutionDetails: { newGreenSoilSurfaces: 50000 },
    });
    assert.strictEqual(result?.letterGrade, "C");
  });

  it(`returns C grade for SUBURBAN_DENSIFICATION projet with new amenities`, () => {
    const result = getLivingEnvironmentScore({
      siteNature: "URBAN_ZONE",
      projectDevelopmentPlanType: "SUBURBAN_DENSIFICATION",
      siteReconversionType: undefined,
      buildingsFloorAreaDistribution: { LOCAL_STORE: 5000, LOCAL_SERVICES: 2000 },
      soilEvolutionDetails: { newGreenSoilSurfaces: 0 },
    });
    assert.strictEqual(result?.letterGrade, "C");
  });

  it(`returns D grade for SUBURBAN_DENSIFICATION projet with no new green soils nor new amenities`, () => {
    const result = getLivingEnvironmentScore({
      siteNature: "URBAN_ZONE",
      projectDevelopmentPlanType: "SUBURBAN_DENSIFICATION",
      siteReconversionType: undefined,
      buildingsFloorAreaDistribution: {},
      soilEvolutionDetails: { newGreenSoilSurfaces: 0 },
    });
    assert.strictEqual(result?.letterGrade, "D");
  });

  it(`returns D grade for agricultural friche reconversion`, () => {
    const result = getLivingEnvironmentScore({
      siteNature: "FRICHE",
      projectDevelopmentPlanType: "URBAN_PROJECT",
      siteReconversionType: "friche_agricole",
      buildingsFloorAreaDistribution: { LOCAL_STORE: 5000, LOCAL_SERVICES: 2000 },
      soilEvolutionDetails: { newGreenSoilSurfaces: 0 },
    });
    assert.strictEqual(result?.letterGrade, "D");
  });

  it(`returns D grade for projet on AGRICULTURAL_OPERATION site`, () => {
    const result = getLivingEnvironmentScore({
      siteNature: "AGRICULTURAL_OPERATION",
      projectDevelopmentPlanType: "URBAN_PROJECT",
      siteReconversionType: undefined,
      buildingsFloorAreaDistribution: { LOCAL_STORE: 5000, LOCAL_SERVICES: 2000 },
      soilEvolutionDetails: { newGreenSoilSurfaces: 0 },
    });
    assert.strictEqual(result?.letterGrade, "D");
  });

  it(`returns E grade for projet on NATURAL_AREA site`, () => {
    const result = getLivingEnvironmentScore({
      siteNature: "NATURAL_AREA",
      projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
      siteReconversionType: undefined,
      buildingsFloorAreaDistribution: {},
      soilEvolutionDetails: { newGreenSoilSurfaces: 5000 },
    });
    assert.strictEqual(result?.letterGrade, "E");
  });
});
