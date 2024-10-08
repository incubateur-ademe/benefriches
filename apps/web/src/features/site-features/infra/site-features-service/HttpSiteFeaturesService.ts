import { FricheActivity, SiteYearlyExpensePurpose, SoilType } from "shared";

import { SiteFeaturesGateway } from "../../application/fetchSiteFeatures.action";
import { SiteFeatures } from "../../domain/siteFeatures";

type SiteFromApi = {
  id: string;
  name: string;
  isFriche: boolean;
  isExpressSite: boolean;
  owner: {
    name?: string;
    structureType: string;
  };
  tenant?: {
    name?: string;
    structureType?: string;
  };
  hasContaminatedSoils?: boolean;
  contaminatedSoilSurface?: number;
  soilsDistribution: Partial<Record<SoilType, number>>;
  surfaceArea: number;
  address: {
    value: string;
  };
  fullTimeJobsInvolved?: number;
  accidentsMinorInjuries?: number;
  accidentsSevereInjuries?: number;
  accidentsDeaths?: number;
  yearlyExpenses: { amount: number; purpose: string }[];
  fricheActivity?: string;
  description?: string;
};

export class HttpSiteFeaturesService implements SiteFeaturesGateway {
  async getSiteFeatures(siteId: string): Promise<SiteFeatures> {
    const response = await fetch(`/api/sites/${siteId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error while fetching site features");

    const jsonResponse = (await response.json()) as SiteFromApi;
    return {
      id: jsonResponse.id,
      isExpressSite: jsonResponse.isExpressSite,
      address: jsonResponse.address.value,
      ownerName: jsonResponse.owner.name || "",
      tenantName: jsonResponse.tenant?.name || "",
      fullTimeJobsInvolved: jsonResponse.fullTimeJobsInvolved,
      accidents: {
        minorInjuries: jsonResponse.accidentsMinorInjuries || 0,
        severyInjuries: jsonResponse.accidentsSevereInjuries || 0,
        accidentsDeaths: jsonResponse.accidentsDeaths || 0,
      },
      expenses: jsonResponse.yearlyExpenses as {
        amount: number;
        purpose: SiteYearlyExpensePurpose;
      }[],
      surfaceArea: jsonResponse.surfaceArea,
      soilsDistribution: jsonResponse.soilsDistribution,
      contaminatedSurfaceArea: jsonResponse.contaminatedSoilSurface,
      fricheActivity: jsonResponse.fricheActivity as FricheActivity | undefined,
      name: jsonResponse.name,
      description: jsonResponse.description || "",
      isFriche: jsonResponse.isFriche,
    };
  }
}
