import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ReconversionProjectImpacts } from "shared";

import type { ReconversionProjectFeaturesView } from "src/reconversion-projects/core/model/reconversionProject";
import type { ComputedImpacts } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";
import type { SiteFeaturesView } from "src/sites/core/models/views";

import {
  buildReferentielProjectsCsvRow,
  REFERENTIEL_PROJECTS_CSV_HEADERS,
} from "./referentielProjectsCsvRow";

type ImpactsInput = Pick<
  ComputedImpacts,
  "id" | "impacts" | "contaminatedSurfaceArea" | "evaluationPeriodInYears"
>;

const EMPTY_IMPACTS: ReconversionProjectImpacts = {
  economicBalance: { total: 0, costs: { total: 0 }, revenues: { total: 0 } },
  socioeconomic: { impacts: [], total: 0 },
  social: {},
  environmental: {
    permeableSurfaceArea: {
      base: 0,
      forecast: 0,
      difference: 0,
      mineralSoil: { base: 0, forecast: 0, difference: 0 },
      greenSoil: { base: 0, forecast: 0, difference: 0 },
    },
  },
};

function buildComputedImpactsInput(overrides: Partial<ImpactsInput> = {}): ImpactsInput {
  return {
    id: "project-1",
    evaluationPeriodInYears: 50,
    impacts: EMPTY_IMPACTS,
    ...overrides,
  };
}

const BASE_SITE_FIELDS = {
  id: "site-1",
  name: "Site Test",
  isExpressSite: false,
  owner: { structureType: "commune" },
  soilsDistribution: {},
  surfaceArea: 12345,
  address: {
    value: "1 rue Test",
    city: "Testville",
    cityCode: "12345",
    postCode: "12345",
    long: 0,
    lat: 0,
  },
  yearlyExpenses: [],
  yearlyIncomes: [],
};

function buildFricheSite(fricheActivity?: string): SiteFeaturesView {
  return {
    ...BASE_SITE_FIELDS,
    nature: "FRICHE",
    ...(fricheActivity !== undefined ? { fricheActivity } : {}),
  };
}

function buildNonFricheSite(): SiteFeaturesView {
  return {
    ...BASE_SITE_FIELDS,
    nature: "AGRICULTURAL_OPERATION",
    agriculturalOperationActivity: "Céréales",
  };
}

function buildUrbanProjectFeatures(
  buildingsFloorAreaDistribution: Partial<Record<string, number>> = {},
): ReconversionProjectFeaturesView {
  return {
    id: "project-1",
    name: "Projet urbain test",
    isExpress: false,
    developmentPlan: {
      type: "URBAN_PROJECT",
      buildingsFloorAreaDistribution,
      installationCosts: [],
    },
    soilsDistribution: [],
    yearlyProjectedExpenses: [],
    yearlyProjectedRevenues: [],
  } as ReconversionProjectFeaturesView;
}

function buildPhotovoltaicProjectFeatures(): ReconversionProjectFeaturesView {
  return {
    id: "project-1",
    name: "Centrale PV test",
    isExpress: false,
    developmentPlan: {
      type: "PHOTOVOLTAIC_POWER_PLANT",
      electricalPowerKWc: 100,
      surfaceArea: 5000,
      expectedAnnualProduction: 1000,
      contractDuration: 30,
      installationCosts: [],
    },
    soilsDistribution: [],
    yearlyProjectedExpenses: [],
    yearlyProjectedRevenues: [],
  };
}

const PROJECT_CONTEXT = { createdBy: "user-1", createdAt: new Date("2024-01-15T10:00:00.000Z") };

/**
 * The 31 blank impact-indicator cells shared by every scenario below (none of the fixtures
 * populate socioeconomic/environmental/social impact details), followed by the three
 * project-type-specific new indicators, which each scenario overrides explicitly.
 */
const BLANK_ADEME_IMPACT_CELLS = [
  "", // fullTimeJobs
  "", // soilsCo2eqStorageBase
  "", // soilsCo2eqStorageForecast
  "", // soilsCo2eqStorageVariation
  "", // avoidedCo2eqEmissionsCarTraffic
  "0", // permeableSurfaceAreaBase
  "0", // permeableSurfaceAreaForecast
  "0", // permeableSurfaceAreaVariation
  "", // contaminatedSurfaceAreaBase
  "", // contaminatedSurfaceAreaForecast
  "", // contaminatedSurfaceAreaDifference
  "0", // ecosystemServicesTotal
  "0", // ecosystemServiceNatureRelatedWellnessAndLeisure
  "0", // ecosystemServiceForestRelatedProduct
  "0", // ecosystemServicePollination
  "0", // ecosystemServiceInvasiveSpeciesRegulation
  "0", // ecosystemServiceWaterCycle
  "0", // ecosystemServiceNitrogenCycle
  "0", // ecosystemServiceSoilErosion
  "0", // ecosystemServiceSoilsCo2EqStorage
  "0", // avoidedFricheCosts
  "0", // taxesIncomeTotal
  "0", // propertyTransferDutiesIncome
  "0", // localTransferDutiesIncrease
  "0", // newHousesTaxesIncome
  "0", // newCompanyTaxationIncome
  "0", // photovoltaicTaxesIncome
  "0", // communalExpensesTotal
  "0", // roadsAndUtilitiesMaintenanceExpenses
  "0", // waterRegulationExpenses
  "0", // avoidedAirPollutionExpenses
  "0", // avoidedCo2EqEmissionsValue
];

describe("buildReferentielProjectsCsvRow", () => {
  it("has a header and a row of the same length", () => {
    const row = buildReferentielProjectsCsvRow(
      PROJECT_CONTEXT,
      buildComputedImpactsInput(),
      buildFricheSite("AGRICULTURE"),
      buildUrbanProjectFeatures(),
    );

    assert.strictEqual(row.length, REFERENTIEL_PROJECTS_CSV_HEADERS.length);
  });

  it("labels a friche whose activity is agriculture as 'Friche agricole'", () => {
    const row = buildReferentielProjectsCsvRow(
      PROJECT_CONTEXT,
      buildComputedImpactsInput(),
      buildFricheSite("AGRICULTURE"),
      buildUrbanProjectFeatures(),
    );

    assert.deepStrictEqual(row, [
      // context
      "project-1",
      "user-1",
      "2024-01-15T10:00:00.000Z",
      // site
      "Testville",
      "Friche agricole",
      "Site Test",
      "12345",
      // project
      "Projet urbain test",
      "Projet urbain",
      "50",
      "0",
      ...Array<string>(20).fill(""),
      // impacts
      ...BLANK_ADEME_IMPACT_CELLS,
      "", // travelTimeSaved (not populated in this fixture)
      "", // avoidedCo2eqEmissionsAirConditioning
      "", // avoidedCo2eqEmissionsRenewableEnergy
    ]);
  });

  it("labels a friche with no recorded activity as 'Autre friche'", () => {
    const row = buildReferentielProjectsCsvRow(
      PROJECT_CONTEXT,
      buildComputedImpactsInput(),
      buildFricheSite(undefined),
      buildUrbanProjectFeatures(),
    );

    assert.strictEqual(row[4], "Autre friche");
  });

  it("labels a friche whose activity is something other than agriculture as 'Autre friche'", () => {
    const row = buildReferentielProjectsCsvRow(
      PROJECT_CONTEXT,
      buildComputedImpactsInput(),
      buildFricheSite("INDUSTRY"),
      buildUrbanProjectFeatures(),
    );

    assert.strictEqual(row[4], "Autre friche");
  });

  it("labels a non-friche site as 'Site non friche'", () => {
    const row = buildReferentielProjectsCsvRow(
      PROJECT_CONTEXT,
      buildComputedImpactsInput(),
      buildNonFricheSite(),
      buildUrbanProjectFeatures(),
    );

    assert.strictEqual(row[4], "Site non friche");
  });

  it("puts a sparse buildings distribution in the correct fixed columns, blank elsewhere, and sums the total floor area", () => {
    const row = buildReferentielProjectsCsvRow(
      PROJECT_CONTEXT,
      buildComputedImpactsInput({
        impacts: {
          ...EMPTY_IMPACTS,
          social: { travelTimeSaved: 4 },
        },
      }),
      buildFricheSite("AGRICULTURE"),
      buildUrbanProjectFeatures({ RESIDENTIAL: 300, OFFICES: 200 }),
    );

    // context(3) + site(4) + [name, type, duration](3) = index 10 is total floor area,
    // 11..30 are the 20 fixed building-use columns in the shared schema's declaration order:
    // RESIDENTIAL is first, OFFICES is 6th.
    assert.strictEqual(row[10], "500");
    assert.strictEqual(row[11], "300"); // RESIDENTIAL
    assert.strictEqual(row[12], ""); // LOCAL_STORE
    assert.strictEqual(row[13], ""); // LOCAL_SERVICES
    assert.strictEqual(row[14], ""); // ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES
    assert.strictEqual(row[15], ""); // PUBLIC_FACILITIES
    assert.strictEqual(row[16], "200"); // OFFICES
    for (let i = 17; i < 31; i++) {
      assert.strictEqual(row[i], "");
    }
  });

  it("leaves the urban-only impact indicators blank and fills the renewable-energy one for a photovoltaic project", () => {
    const row = buildReferentielProjectsCsvRow(
      PROJECT_CONTEXT,
      buildComputedImpactsInput({
        impacts: {
          ...EMPTY_IMPACTS,
          environmental: {
            ...EMPTY_IMPACTS.environmental,
            avoidedCo2eqEmissions: { withRenewableEnergyProduction: 12 },
          },
        },
      }),
      buildFricheSite("AGRICULTURE"),
      buildPhotovoltaicProjectFeatures(),
    );

    assert.strictEqual(row.at(-3), ""); // travel time saved: urban-only
    assert.strictEqual(row.at(-2), ""); // avoided CO2 via air conditioning: urban-only
    assert.strictEqual(row.at(-1), "12"); // avoided CO2 via renewable energy: PV-only

    // photovoltaic rows have no building-use typology at all
    assert.strictEqual(row[8], "Centrale photovoltaïque");
    assert.strictEqual(row[10], ""); // total floor area
    for (let i = 11; i < 31; i++) {
      assert.strictEqual(row[i], "");
    }
  });

  it("fills the urban-only impact indicators and leaves the renewable-energy one blank for an urban project", () => {
    const row = buildReferentielProjectsCsvRow(
      PROJECT_CONTEXT,
      buildComputedImpactsInput({
        impacts: {
          ...EMPTY_IMPACTS,
          social: { travelTimeSaved: 4 },
          environmental: {
            ...EMPTY_IMPACTS.environmental,
            avoidedCo2eqEmissions: { withAirConditioningDiminution: 7 },
          },
        },
      }),
      buildFricheSite("AGRICULTURE"),
      buildUrbanProjectFeatures(),
    );

    assert.strictEqual(row.at(-3), "4"); // travel time saved
    assert.strictEqual(row.at(-2), "7"); // avoided CO2 via air conditioning
    assert.strictEqual(row.at(-1), ""); // avoided CO2 via renewable energy: PV-only
  });

  it("leaves the site cells blank when the site lookup failed, without dropping the row", () => {
    const row = buildReferentielProjectsCsvRow(
      PROJECT_CONTEXT,
      buildComputedImpactsInput(),
      undefined,
      buildUrbanProjectFeatures({ RESIDENTIAL: 300 }),
    );

    assert.strictEqual(row.length, REFERENTIEL_PROJECTS_CSV_HEADERS.length);
    assert.deepStrictEqual(row.slice(3, 7), ["", "", "", ""]); // commune, type de site, nom du site, surface du site
    assert.strictEqual(row[7], "Projet urbain test"); // project name still present
  });

  it("leaves the project cells blank when the project features lookup failed, without dropping the row", () => {
    const row = buildReferentielProjectsCsvRow(
      PROJECT_CONTEXT,
      buildComputedImpactsInput(),
      buildFricheSite("AGRICULTURE"),
      undefined,
    );

    assert.strictEqual(row.length, REFERENTIEL_PROJECTS_CSV_HEADERS.length);
    assert.strictEqual(row[4], "Friche agricole"); // site block still present
    assert.deepStrictEqual([row[7], row[8]], ["", ""]); // project name, project type
    assert.strictEqual(row[9], "50"); // evaluation period comes from computed impacts, not features
    assert.deepStrictEqual(row.slice(10, 31), Array<string>(21).fill("")); // total floor area + 20 building uses
  });
});
