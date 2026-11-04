import type { SiteStatuQuoEconomicImpact } from "../../site";
import type {
  AggregatedReconversionProjectOnSiteImpactItemView,
  UrbanSprawlComparisonIndirectEconomicImpactItemView,
} from "../projectImpacts.types";

type IndirectEconomicImpactCategory =
  | "localPropertyValueIncrease"
  | "rentalIncome"
  | "taxesIncome"
  | "operatingEconomicBalance"
  | "fricheCosts"
  | "municipalityExpenses"
  | "purchasingPowerIncrease"
  | "environmentalAction"
  | "avoidedHealthExpenses";

export type IndirectEconomicImpactItem =
  | AggregatedReconversionProjectOnSiteImpactItemView
  | UrbanSprawlComparisonIndirectEconomicImpactItemView
  | SiteStatuQuoEconomicImpact;

export type IndirectEconomicImpactsGroupedByCategory<
  T extends IndirectEconomicImpactItem = IndirectEconomicImpactItem,
> = Partial<Record<IndirectEconomicImpactCategory, T[]>>;

export type LocalAuthorityIndirectEconomicImpactCategory =
  | "rentalIncome"
  | "taxesIncome"
  | "fricheCosts"
  | "municipalityExpenses"
  | "operatingEconomicBalance";

export type IndirectEconomicImpactsByBearerAndGroupCategory<
  T extends IndirectEconomicImpactItem = IndirectEconomicImpactItem,
> = {
  total: number;
  localAuthority: {
    total: number;
  } & Pick<
    IndirectEconomicImpactsGroupedByCategory<T>,
    LocalAuthorityIndirectEconomicImpactCategory
  >;
  localPeopleOrCompany: {
    total: number;
  } & Pick<
    IndirectEconomicImpactsGroupedByCategory<T>,
    | "rentalIncome"
    | "fricheCosts"
    | "operatingEconomicBalance"
    | "localPropertyValueIncrease"
    | "purchasingPowerIncrease"
  >;
  humanity: {
    total: number;
  } & Pick<
    IndirectEconomicImpactsGroupedByCategory<T>,
    "avoidedHealthExpenses" | "environmentalAction"
  >;
};
