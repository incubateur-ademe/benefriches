import {
  Address,
  FricheActivity,
  SiteNature,
  SiteYearlyExpensePurpose,
  SiteYearlyIncome,
  SoilType,
} from "shared";

import { SiteFeaturesGateway } from "../../core/fetchSiteFeatures.action";
import { SiteFeatures } from "../../core/siteFeatures";

type SiteFromApi = {
  id: string;
  name: string;
  nature: SiteNature;
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
  address: Address;
  accidentsMinorInjuries?: number;
  accidentsSevereInjuries?: number;
  accidentsDeaths?: number;
  yearlyExpenses: { amount: number; purpose: string }[];
  yearlyIncomes: { amount: number; source: string }[];
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
      nature: jsonResponse.nature,
      isExpressSite: jsonResponse.isExpressSite,
      address: jsonResponse.address.value,
      ownerName: jsonResponse.owner.name || "",
      tenantName: jsonResponse.tenant?.name || "",
      accidents: {
        minorInjuries: jsonResponse.accidentsMinorInjuries || 0,
        severyInjuries: jsonResponse.accidentsSevereInjuries || 0,
        accidentsDeaths: jsonResponse.accidentsDeaths || 0,
      },
      expenses: jsonResponse.yearlyExpenses as {
        amount: number;
        purpose: SiteYearlyExpensePurpose;
      }[],
      incomes: jsonResponse.yearlyIncomes as {
        amount: number;
        source: SiteYearlyIncome["source"];
      }[],
      surfaceArea: jsonResponse.surfaceArea,
      soilsDistribution: jsonResponse.soilsDistribution,
      contaminatedSurfaceArea: jsonResponse.contaminatedSoilSurface,
      fricheActivity: jsonResponse.fricheActivity as FricheActivity | undefined,
      name: jsonResponse.name,
      description: jsonResponse.description || "",
    };
  }
}
