import {
  AgriculturalOperationActivity,
  FricheActivity,
  getSiteFeaturesResponseDtoSchema,
  getSiteViewResponseDtoSchema,
  NaturalAreaType,
  SiteYearlyExpensePurpose,
  SiteYearlyIncome,
  type GetSiteFeaturesResponseDto,
} from "shared";

import type { SiteGateway } from "../../core/gateways/SiteGateway";
import type { SiteFeatures, SiteView } from "../../core/site.types";

const mapApiSiteFeaturesResponseToFeaturesView = (
  apiResponse: GetSiteFeaturesResponseDto,
): SiteFeatures => {
  const baseSiteFeatures = {
    id: apiResponse.id,
    isExpressSite: apiResponse.isExpressSite,
    address: apiResponse.address.value,
    ownerName: apiResponse.owner.name || "",
    tenantName: apiResponse.tenant?.name || "",
    expenses: apiResponse.yearlyExpenses as {
      amount: number;
      purpose: SiteYearlyExpensePurpose;
    }[],
    incomes: apiResponse.yearlyIncomes as {
      amount: number;
      source: SiteYearlyIncome["source"];
    }[],
    surfaceArea: apiResponse.surfaceArea,
    soilsDistribution: apiResponse.soilsDistribution,
    name: apiResponse.name,
    description: apiResponse.description || "",
  };

  switch (apiResponse.nature) {
    case "FRICHE":
      return {
        ...baseSiteFeatures,
        nature: "FRICHE",
        contaminatedSurfaceArea: apiResponse.contaminatedSoilSurface,
        accidents: {
          minorInjuries: apiResponse.accidentsMinorInjuries || 0,
          severeInjuries: apiResponse.accidentsSevereInjuries || 0,
          accidentsDeaths: apiResponse.accidentsDeaths || 0,
        },
        fricheActivity: apiResponse.fricheActivity as FricheActivity | undefined,
      };
    case "AGRICULTURAL_OPERATION":
      return {
        ...baseSiteFeatures,
        nature: "AGRICULTURAL_OPERATION",
        agriculturalOperationActivity:
          apiResponse.agriculturalOperationActivity as AgriculturalOperationActivity,
      };
    case "NATURAL_AREA":
      return {
        ...baseSiteFeatures,
        nature: "NATURAL_AREA",
        naturalAreaType: apiResponse.naturalAreaType as NaturalAreaType,
      };
    case "URBAN_ZONE":
      return {
        ...baseSiteFeatures,
        nature: "URBAN_ZONE",
        contaminatedSurfaceArea: apiResponse.contaminatedSoilSurface,
        urbanZoneType: apiResponse.urbanZoneType,
        managerName: apiResponse.manager?.name,
        vacantCommercialPremisesFootprint: apiResponse.vacantCommercialPremisesFootprint,
        vacantCommercialPremisesFloorArea: apiResponse.vacantCommercialPremisesFloorArea,
        fullTimeJobsEquivalent: apiResponse.fullTimeJobsEquivalent,
      };
  }
};

export class HttpSiteService implements SiteGateway {
  async getSiteFeatures(siteId: string): Promise<SiteFeatures> {
    const response = await fetch(`/api/sites/${siteId}/features`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error while fetching site features");

    const jsonResponse = (await response.json()) as unknown;

    const siteFeaturesParsingResult = getSiteFeaturesResponseDtoSchema.safeParse(jsonResponse);

    if (!siteFeaturesParsingResult.success) {
      throw new Error("HttpSiteService: Invalid response format", siteFeaturesParsingResult.error);
    }

    return mapApiSiteFeaturesResponseToFeaturesView(siteFeaturesParsingResult.data);
  }

  async getSiteView(siteId: string): Promise<SiteView> {
    const response = await fetch(`/api/sites/${siteId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error while fetching site view");

    const jsonResponse = (await response.json()) as unknown;

    const siteViewParsingResult = getSiteViewResponseDtoSchema.safeParse(jsonResponse);

    if (!siteViewParsingResult.success) {
      throw new Error("HttpSiteService: Invalid response format", siteViewParsingResult.error);
    }
    return {
      id: siteViewParsingResult.data.id,
      features: mapApiSiteFeaturesResponseToFeaturesView(siteViewParsingResult.data.features),
      actions: siteViewParsingResult.data.actions,
      reconversionProjects: siteViewParsingResult.data.reconversionProjects,
      compatibilityEvaluation: siteViewParsingResult.data.compatibilityEvaluation,
    };
  }
}
