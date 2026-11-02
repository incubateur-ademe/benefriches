import { afterEach, describe, expect, it, vi } from "vitest";

import { HttpSiteService } from "./HttpSiteService";

const urbanZoneFeaturesResponse = {
  id: "site-1",
  name: "ZAE Chartres",
  nature: "URBAN_ZONE",
  isExpressSite: false,
  owner: { name: "Mairie de Chartres", structureType: "municipality" },
  surfaceArea: 10000,
  soilsDistribution: { BUILDINGS: 6000, MINERAL_SOIL: 4000 },
  address: {
    value: "Chartres",
    city: "Chartres",
    cityCode: "28085",
    postCode: "28000",
    lat: 48.44,
    long: 1.48,
  },
  yearlyExpenses: [],
  yearlyIncomes: [],
  urbanZoneType: "ECONOMIC_ACTIVITY_ZONE",
  landParcels: [
    {
      type: "COMMERCIAL_ACTIVITY_AREA",
      surfaceArea: 6000,
      soilsDistribution: { BUILDINGS: 6000 },
      buildingsFloorSurfaceArea: 3000,
    },
    {
      type: "PUBLIC_SPACES",
      surfaceArea: 4000,
      soilsDistribution: { MINERAL_SOIL: 4000 },
    },
  ],
  hasContaminatedSoils: true,
  contaminatedSoilSurface: 2500,
};

describe("HttpSiteService", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps an urban zone's land-parcel split and polluted surface in the site features", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(Response.json(urbanZoneFeaturesResponse))),
    );

    const siteFeatures = await new HttpSiteService().getSiteFeatures("site-1");

    expect(siteFeatures).toEqual({
      id: "site-1",
      isExpressSite: false,
      address: "Chartres",
      ownerName: "Mairie de Chartres",
      tenantName: "",
      expenses: [],
      incomes: [],
      surfaceArea: 10000,
      soilsDistribution: { BUILDINGS: 6000, MINERAL_SOIL: 4000 },
      name: "ZAE Chartres",
      description: "",
      nature: "URBAN_ZONE",
      urbanZoneType: "ECONOMIC_ACTIVITY_ZONE",
      contaminatedSurfaceArea: 2500,
      landParcels: [
        { type: "COMMERCIAL_ACTIVITY_AREA", surfaceArea: 6000 },
        { type: "PUBLIC_SPACES", surfaceArea: 4000 },
      ],
      managerName: undefined,
      vacantCommercialPremisesFootprint: undefined,
      vacantCommercialPremisesFloorArea: undefined,
      fullTimeJobsEquivalent: undefined,
    });
  });
});
