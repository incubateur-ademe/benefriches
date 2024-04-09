import { ReconversionProjectImpacts } from "@/features/projects/domain/impacts.types";
import { sumList } from "@/shared/services/sum/sum";

type SocioEconomicImpacts = ReconversionProjectImpacts["socioeconomic"]["impacts"];

type SocioEconomicImpactCategory = SocioEconomicImpacts[number]["impactCategory"];

type SocioEconomicImpactByCategory = Map<SocioEconomicImpactCategory, number>;
type SocioEconomicImpactByActor = Map<string, number>;

export const sumSocioEconomicImpactsByCategory = (
  socioEconomicImpacts: ReconversionProjectImpacts["socioeconomic"]["impacts"],
): SocioEconomicImpactByCategory => {
  return socioEconomicImpacts.reduce((impactGroups, impact) => {
    const impactGroup = impactGroups.get(impact.impactCategory);
    const totalAmountForImpactCategory = impact.amount + (impactGroup ?? 0);
    return impactGroups.set(impact.impactCategory, totalAmountForImpactCategory);
  }, new Map<SocioEconomicImpactCategory, number>());
};

export const sumSocioEconomicImpactsByActor = (
  socioEconomicImpacts: ReconversionProjectImpacts["socioeconomic"]["impacts"],
): SocioEconomicImpactByActor => {
  return socioEconomicImpacts.reduce((impactGroups, impact) => {
    const impactGroup = impactGroups.get(impact.actor);
    const totalAmountForActor = impact.amount + (impactGroup ?? 0);
    return impactGroups.set(impact.actor, totalAmountForActor);
  }, new Map<string, number>());
};

export const getPositiveSocioEconomicImpacts = (
  socioEconomicImpactsByCategory: SocioEconomicImpactByCategory,
): SocioEconomicImpactByCategory => {
  return new Map([...socioEconomicImpactsByCategory].filter(([, amount]) => amount > 0));
};

export const getNegativeSocioEconomicImpacts = (
  socioEconomicImpactsByCategory: SocioEconomicImpactByCategory,
): SocioEconomicImpactByCategory => {
  return new Map([...socioEconomicImpactsByCategory].filter(([, amount]) => amount < 0));
};

export const getTotalImpactsAmount = (
  socioEconomicImpactsByCategory: SocioEconomicImpactByCategory,
): number => {
  return sumList(Array.from(socioEconomicImpactsByCategory.values()));
};

export const getLabelForSocioEconomicImpactCategory = (
  socioEconomicImpactCategory: SocioEconomicImpactCategory,
): string => {
  switch (socioEconomicImpactCategory) {
    case "economic_direct":
      return "Économiques directs";
    case "economic_indirect":
      return "Économiques indirects";
    case "environmental_monetary":
      return "Environnementaux monétarisés";
  }
};
