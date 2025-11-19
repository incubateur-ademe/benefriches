import {
  Address,
  AgriculturalOperationActivity,
  DevelopmentPlanType,
  FricheActivity,
  NaturalAreaType,
  SiteNature,
  SiteYearlyExpensePurpose,
  SiteYearlyIncome,
  SoilType,
} from "shared";

import { SiteGateway } from "../../core/fetchSiteFeatures.action";
import { SiteFeatures, SiteView } from "../../core/site.types";

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
  agriculturalOperationActivity?: string;
  naturalAreaType?: string;
  description?: string;
};

type SiteViewFromApi = {
  features: SiteFromApi;
  reconversionProjects: {
    id: string;
    name: string;
    type: DevelopmentPlanType;
  }[];
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
      agriculturalOperationActivity: jsonResponse.agriculturalOperationActivity as
        | AgriculturalOperationActivity
        | undefined,
      naturalAreaType: jsonResponse.naturalAreaType as NaturalAreaType | undefined,
      name: jsonResponse.name,
      description: jsonResponse.description || "",
    };
  }

  async getSiteView(siteId: string): Promise<SiteView> {
    const response = await fetch(`/api/sites/${siteId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error while fetching site view");

    const jsonResponse = (await response.json()) as SiteViewFromApi;

    const features: SiteFeatures = {
      id: jsonResponse.features.id,
      nature: jsonResponse.features.nature,
      isExpressSite: jsonResponse.features.isExpressSite,
      address: jsonResponse.features.address.value,
      ownerName: jsonResponse.features.owner.name || "",
      tenantName: jsonResponse.features.tenant?.name || "",
      accidents: {
        minorInjuries: jsonResponse.features.accidentsMinorInjuries || 0,
        severyInjuries: jsonResponse.features.accidentsSevereInjuries || 0,
        accidentsDeaths: jsonResponse.features.accidentsDeaths || 0,
      },
      expenses: jsonResponse.features.yearlyExpenses as {
        amount: number;
        purpose: SiteYearlyExpensePurpose;
      }[],
      incomes: jsonResponse.features.yearlyIncomes as {
        amount: number;
        source: SiteYearlyIncome["source"];
      }[],
      surfaceArea: jsonResponse.features.surfaceArea,
      soilsDistribution: jsonResponse.features.soilsDistribution,
      contaminatedSurfaceArea: jsonResponse.features.contaminatedSoilSurface,
      fricheActivity: jsonResponse.features.fricheActivity as FricheActivity | undefined,
      agriculturalOperationActivity: jsonResponse.features.agriculturalOperationActivity as
        | AgriculturalOperationActivity
        | undefined,
      naturalAreaType: jsonResponse.features.naturalAreaType as NaturalAreaType | undefined,
      name: jsonResponse.features.name,
      description: jsonResponse.features.description || "",
    };

    const reconversionProjects: SiteView["reconversionProjects"] =
      jsonResponse.reconversionProjects.map((project) => ({
        id: project.id,
        name: project.name,
        type: project.type,
      }));

    return {
      id: jsonResponse.features.id,
      features,
      reconversionProjects,
    };
  }
}
