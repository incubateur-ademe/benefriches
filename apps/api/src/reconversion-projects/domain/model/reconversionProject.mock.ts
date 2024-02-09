import { ReconversionProjectProps } from "../usecases/createReconversionProject.usecase";
import { ReconversionProject } from "./reconversionProject";

export const buildMinimalReconversionProjectProps = (
  propsOverride?: Partial<ReconversionProjectProps>,
): ReconversionProjectProps => {
  return {
    id: "64789135-afad-46ea-97a2-f14ba460d485",
    relatedSiteId: "f590f643-cd9a-4187-8973-f90e9f1998c8",
    name: "Centrale photovoltaique",
    developmentPlans: [
      {
        type: "PHOTOVOLTAIC_POWER_PLANT",
        surfaceArea: 1200,
        cost: 1300,
        features: {
          contractDuration: 25,
          electricalPowerKWc: 10000,
          expectedAnnualProduction: 12000,
        },
      },
    ],
    soilsDistribution: {
      BUILDINGS: 3000,
      ARTIFICIAL_TREE_FILLED: 5000,
      FOREST_MIXED: 60000,
      MINERAL_SOIL: 5000,
      IMPERMEABLE_SOILS: 1300,
    },
    financialAssistanceRevenue: 120,
    yearlyProjectedCosts: [{ purpose: "rent", amount: 12000 }],
    yearlyProjectedRevenues: [{ source: "operations", amount: 13000 }],

    ...propsOverride,
  };
};

export const buildReconversionProject = (
  props?: Partial<ReconversionProject>,
): ReconversionProject => {
  return {
    ...buildMinimalReconversionProjectProps(),
    createdAt: new Date(),
    ...props,
  };
};
