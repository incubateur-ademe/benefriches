import { IndirectEconomicImpactsByBearerAndGroupCategory } from "@/features/projects/domain/groupIndirectImpactsByBearer";

type HumanityImpactCategory = Exclude<
  keyof IndirectEconomicImpactsByBearerAndGroupCategory["humanity"],
  "total"
>;

export const HUMANITY_IMPACTS_CATEGORIES: Record<
  HumanityImpactCategory,
  { label: string; color: string }
> = {
  avoidedHealthExpenses: {
    label: "🫀 Économies sur les dépenses de santé",
    color: "#D0E24B",
  },
  environmentalAction: {
    label: "🌿 Valeur de l’action environnementale",
    color: "#6CE24B",
  },
};

type LocalAuthorityImpactCategory = Exclude<
  keyof IndirectEconomicImpactsByBearerAndGroupCategory["localAuthority"],
  "total"
>;
export const LOCAL_AUTHORITY_IMPACTS_CATEGORIES: Record<
  LocalAuthorityImpactCategory,
  { label: string; color: string }
> = {
  fricheCosts: {
    label: "🏚️ Économies réalisées grâce à la suppression de la friche",
    color: "#25CB7B",
  },
  taxesIncome: {
    label: "🏛️ Recettes fiscales",
    color: "#1D5DA2",
  },
  operatingEconomicBalance: {
    label: "💰‍️ Bénéfices d'exploitation",
    color: "#1BBB36",
  },
  rentalIncome: {
    label: "🔑 Revenus locatifs communaux",
    color: "#B4D21E",
  },
  municipalityExpenses: {
    label: "👷 Dépenses communales",
    color: "#6145DE",
  },
};

type LocalPeopleOrCompanyImpactCategory = Exclude<
  keyof IndirectEconomicImpactsByBearerAndGroupCategory["localPeopleOrCompany"],
  "total"
>;
export const LOCAL_PEOPLE_OR_COMPANY_IMPACTS_CATEGORIES: Record<
  LocalPeopleOrCompanyImpactCategory,
  { label: string; color: string }
> = {
  fricheCosts: {
    label: "🏚️ Économies réalisées grâce à la suppression de la friche",
    color: "#25CB7B",
  },
  purchasingPowerIncrease: {
    label: "👛 Pouvoir d’achat des riverains",
    color: "#F57CFD",
  },
  operatingEconomicBalance: {
    label: "💰‍️ Bénéfices d'exploitation",
    color: "#1BBB36",
  },
  rentalIncome: {
    label: "🔑 Revenus locatifs",
    color: "#B4D21E",
  },
  localPropertyValueIncrease: {
    label: "🏡 Valeur patrimoniale autour de la friche",
    color: "#FD7C85",
  },
};
