import {
  AvoidedTrafficAccidentsImpact,
  EcosystemServicesImpact,
  sumListWithKey,
  AvoidedFricheCostsImpact,
  ReconversionProjectImpacts,
  SocioEconomicImpact,
  AvoidedCO2EqEmissions,
  TaxesIncomeImpact,
} from "shared";

import { ReconversionProjectImpactsResult } from "../application/fetchImpactsForReconversionProject.action";

export type SocioEconomicImpactByCategory = {
  total: number;
  impacts: {
    name: SocioEconomicMainImpactName;
    actors: {
      name: string;
      value: number;
      details?: {
        name: SocioEconomicDetailsName;
        value: number;
      }[];
    }[];
  }[];
};

export type SocioEconomicDetailedImpact = {
  total: number;
  economicDirect: SocioEconomicImpactByCategory;
  economicIndirect: SocioEconomicImpactByCategory;
  socialMonetary: SocioEconomicImpactByCategory;
  environmentalMonetary: SocioEconomicImpactByCategory;
};

export type SocioEconomicImpactName = SocioEconomicMainImpactName | SocioEconomicDetailsName;
export type SocioEconomicMainImpactName = SocioEconomicImpact["impact"];

export type SocioEconomicDetailsName =
  | TaxesIncomeImpact["details"][number]["impact"]
  | AvoidedCO2EqEmissions["details"][number]["impact"]
  | EcosystemServicesImpact["details"][number]["impact"]
  | AvoidedTrafficAccidentsImpact["details"][number]["impact"]
  | AvoidedFricheCostsImpact["details"][number]["impact"];

type Impact = {
  impact: SocioEconomicMainImpactName;
  impactCategory: SocioEconomicImpact["actor"];
  actor: string;
  amount: number;
  details?: {
    amount: number;
    impact: SocioEconomicDetailsName;
  }[];
};

const formatImpactsWithActors = (impacts: Impact[]) => {
  return Array.from(new Set(impacts.map(({ impact }) => impact))).map((impactName) => {
    return {
      name: impactName,
      actors: impacts
        .filter((impact) => impact.impact === impactName)
        .map((impact) => {
          if (!impact.details) {
            return {
              value: impact.amount,
              name: impact.actor,
            };
          }
          return {
            value: impact.amount,
            name: impact.actor,
            details: impact.details.map(({ amount, impact }) => ({ name: impact, value: amount })),
          };
        }),
    };
  });
};

export const getDetailedSocioEconomicProjectImpacts = (
  impactsData?: ReconversionProjectImpactsResult["impacts"],
): SocioEconomicDetailedImpact => {
  const { impacts: socioEconomicImpacts } = impactsData?.socioeconomic ?? {
    total: 0,
    impacts: [],
  };

  const economicDirectImpacts = socioEconomicImpacts.filter(
    (impact) => impact.impactCategory === "economic_direct",
  );
  const economicDirect = {
    total: sumListWithKey(economicDirectImpacts, "amount"),
    impacts: formatImpactsWithActors(economicDirectImpacts),
  };

  const economicIndirectImpacts = socioEconomicImpacts.filter(
    (impact) => impact.impactCategory === "economic_indirect",
  );
  const economicIndirect = {
    total: sumListWithKey(economicIndirectImpacts, "amount"),
    impacts: formatImpactsWithActors(economicIndirectImpacts),
  };

  const socialMonetaryImpacts = socioEconomicImpacts.filter(
    (impact) => impact.impactCategory === "social_monetary",
  );
  const socialMonetary = {
    total: sumListWithKey(socialMonetaryImpacts, "amount"),
    impacts: formatImpactsWithActors(socialMonetaryImpacts),
  };

  const environmentalMonetaryImpacts = socioEconomicImpacts.filter(
    (impact) => impact.impactCategory === "environmental_monetary",
  );
  const environmentalMonetary = {
    total: sumListWithKey(environmentalMonetaryImpacts, "amount"),
    impacts: formatImpactsWithActors(environmentalMonetaryImpacts),
  };

  return {
    total:
      economicDirect.total +
      economicIndirect.total +
      environmentalMonetary.total +
      socialMonetary.total,
    economicDirect,
    economicIndirect,
    socialMonetary,
    environmentalMonetary,
  };
};

type ImpactName = ReconversionProjectImpacts["socioeconomic"]["impacts"][number]["impact"];

const getGroupedByImpactName = (impacts: { amount: number; impact: ImpactName }[]) => {
  const byImpactsName = Array.from(new Set(impacts.map(({ impact }) => impact))).map(
    (impactName) => {
      return {
        name: impactName,
        value: sumListWithKey(
          impacts.filter((impact) => impact.impact === impactName),
          "amount",
        ),
      };
    },
  );
  return {
    impacts: byImpactsName,
    total: sumListWithKey(impacts, "amount"),
  };
};

export type SocioEconomicImpactByActor = {
  name: string;
  total: number;
  impacts: { name: SocioEconomicMainImpactName; value: number }[];
}[];
export const getSocioEconomicProjectImpactsByActor = (
  socioEconomicImpacts: ReconversionProjectImpactsResult["impacts"]["socioeconomic"]["impacts"] = [],
): SocioEconomicImpactByActor => {
  const mergedActors = socioEconomicImpacts.map((impact) => ({
    ...impact,
    actor: ["local_people", "local_companies"].includes(impact.actor)
      ? "local_people_or_companies"
      : impact.actor,
  }));

  const distinctActors = Array.from(new Set(mergedActors.map(({ actor }) => actor)));

  const byActor = distinctActors.map((actor) => {
    const impacts = mergedActors.filter((impact) => impact.actor === actor);
    return {
      name: actor,
      ...getGroupedByImpactName(impacts),
    };
  });

  return byActor;
};
