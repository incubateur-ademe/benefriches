import {
  FinancialAssistanceRevenue,
  ReinstatementExpense,
  sumListWithKey,
  typedObjectKeys,
  UrbanProjectDevelopmentExpense,
  UrbanProjectPhase,
  YearlyBuildingsOperationsRevenues,
  YearlyBuildingsOperationsExpenses,
} from "shared";
import type { UrbanProjectUse } from "shared";

import { ProjectStakeholder } from "@/features/create-project/core/project.types";
import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import {
  ANSWER_STEPS,
  INTRODUCTION_STEPS,
  SUMMARY_STEPS,
} from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

import { UpdateProjectView } from "../updateProject.types";

export const convertProjectDataToSteps = ({ projectData, siteData }: UpdateProjectView) => {
  const steps: ProjectFormState["urbanProject"]["steps"] = {};

  if (
    projectData.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT" ||
    projectData.creationMode === "express"
  ) {
    return steps;
  }

  const developmentPlan = projectData.developmentPlan;

  const hasBuildings =
    typedObjectKeys(developmentPlan.features.buildingsFloorAreaDistribution).length > 0;

  const publicGreenSpaceSoils = projectData.soilsDistribution.filter(
    ({ spaceCategory }) => spaceCategory === "PUBLIC_GREEN_SPACE",
  );
  const otherSoils = projectData.soilsDistribution.filter(
    ({ spaceCategory }) => spaceCategory !== "PUBLIC_GREEN_SPACE",
  );

  ANSWER_STEPS.forEach((stepId) => {
    switch (stepId) {
      case "URBAN_PROJECT_USES_SELECTION": {
        const usesSelection: UrbanProjectUse[] = typedObjectKeys(
          developmentPlan.features.buildingsFloorAreaDistribution,
        );
        if (publicGreenSpaceSoils.length > 0) {
          usesSelection.push("PUBLIC_GREEN_SPACES");
        }
        if (otherSoils.some(({ soilType }) => soilType !== "BUILDINGS")) {
          usesSelection.push("OTHER_PUBLIC_SPACES");
        }
        steps["URBAN_PROJECT_USES_SELECTION"] = {
          payload: { usesSelection },
          completed: true,
        };
        break;
      }
      case "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA":
        if (publicGreenSpaceSoils.length > 0) {
          steps["URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA"] = {
            payload: {
              publicGreenSpacesSurfaceArea: sumListWithKey(publicGreenSpaceSoils, "surfaceArea"),
            },
            completed: true,
          };
        }
        break;
      case "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION":
        if (publicGreenSpaceSoils.length > 0) {
          steps["URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION"] = {
            payload: {
              publicGreenSpacesSoilsDistribution: Object.fromEntries(
                publicGreenSpaceSoils.map(({ soilType, surfaceArea }) => [soilType, surfaceArea]),
              ),
            },
            completed: true,
          };
        }
        break;
      case "URBAN_PROJECT_SPACES_SELECTION":
        if (otherSoils.length > 0) {
          const uniqueSoilTypes = [...new Set(otherSoils.map(({ soilType }) => soilType))];
          steps["URBAN_PROJECT_SPACES_SELECTION"] = {
            payload: {
              spacesSelection: uniqueSoilTypes,
            },
            completed: true,
          };
        }
        break;
      case "URBAN_PROJECT_SPACES_SURFACE_AREA":
        if (otherSoils.length > 0) {
          const aggregatedDistribution: Record<string, number> = {};
          for (const { soilType, surfaceArea } of otherSoils) {
            aggregatedDistribution[soilType] =
              (aggregatedDistribution[soilType] ?? 0) + surfaceArea;
          }
          steps["URBAN_PROJECT_SPACES_SURFACE_AREA"] = {
            payload: {
              spacesSurfaceAreaDistribution: aggregatedDistribution,
            },
            completed: true,
          };
        }
        break;
      case "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA":
        if (hasBuildings) {
          steps["URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA"] = {
            payload: {
              usesFloorSurfaceAreaDistribution:
                developmentPlan.features.buildingsFloorAreaDistribution,
            },
            completed: true,
          };
        }
        break;
      case "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION": {
        if (siteData.nature === "FRICHE") {
          const contaminatedSoilSurface = siteData?.contaminatedSoilSurface ?? 0;
          const defaultValue = contaminatedSoilSurface * 0.25;
          steps["URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION"] = {
            payload: {
              decontaminationPlan:
                projectData.decontaminatedSoilSurface === 0
                  ? "none"
                  : projectData.decontaminatedSoilSurface === defaultValue
                    ? "unknown"
                    : "partial",
            },
            completed: true,
          };
        }

        break;
      }
      case "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA":
        if (siteData.nature === "FRICHE") {
          steps["URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA"] = {
            payload: {
              decontaminatedSurfaceArea: projectData.decontaminatedSoilSurface,
            },
            completed: true,
          };
        }
        break;

      case "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER": {
        if (developmentPlan.developer) {
          steps["URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER"] = {
            payload: {
              projectDeveloper: developmentPlan.developer as ProjectStakeholder,
            },
            completed: true,
          };
        }
        break;
      }
      case "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER": {
        if (siteData.nature === "FRICHE") {
          steps["URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER"] = {
            payload: {
              reinstatementContractOwner:
                projectData.reinstatementContractOwner as ProjectStakeholder,
            },
            completed: true,
          };
        }
        break;
      }
      case "URBAN_PROJECT_SITE_RESALE_SELECTION":
        steps["URBAN_PROJECT_SITE_RESALE_SELECTION"] = {
          payload: {
            siteResaleSelection: projectData.siteResaleExpectedSellingPrice ? "yes" : "no",
          },
          completed: true,
        };
        break;
      case "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION":
        steps["URBAN_PROJECT_BUILDINGS_RESALE_SELECTION"] = {
          payload: {
            buildingsResalePlannedAfterDevelopment: Boolean(
              projectData.buildingsResaleExpectedSellingPrice,
            ),
            futureOperator: projectData.futureOperator as ProjectStakeholder,
          },
          completed: true,
        };
        break;
      case "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS":
        steps["URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS"] = {
          payload: {
            sitePurchasePropertyTransferDuties: projectData.sitePurchasePropertyTransferDuties,
            sitePurchaseSellingPrice: projectData.sitePurchaseSellingPrice,
          },
          completed: true,
        };
        break;
      case "URBAN_PROJECT_EXPENSES_REINSTATEMENT":
        steps["URBAN_PROJECT_EXPENSES_REINSTATEMENT"] = {
          payload: {
            reinstatementExpenses: projectData.reinstatementCosts as ReinstatementExpense[],
          },
          completed: true,
        };
        break;
      case "URBAN_PROJECT_EXPENSES_INSTALLATION":
        steps["URBAN_PROJECT_EXPENSES_INSTALLATION"] = {
          payload: {
            installationExpenses: developmentPlan.costs as UrbanProjectDevelopmentExpense[],
          },
          completed: true,
        };
        break;
      case "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES":
        steps["URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES"] = {
          payload: {
            yearlyProjectedBuildingsOperationsExpenses:
              projectData.yearlyProjectedCosts as YearlyBuildingsOperationsExpenses[],
          },
          completed: true,
        };
        break;
      case "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE":
        steps["URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE"] = {
          payload: {
            siteResaleExpectedPropertyTransferDuties:
              projectData.siteResaleExpectedPropertyTransferDuties,
            siteResaleExpectedSellingPrice: projectData.siteResaleExpectedSellingPrice,
          },
          completed: true,
        };
        break;
      case "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE":
        steps["URBAN_PROJECT_REVENUE_BUILDINGS_RESALE"] = {
          payload: {
            buildingsResalePropertyTransferDuties:
              projectData.buildingsResaleExpectedPropertyTransferDuties,
            buildingsResaleSellingPrice: projectData.buildingsResaleExpectedSellingPrice,
          },
          completed: true,
        };
        break;
      case "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES":
        steps["URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES"] = {
          payload: {
            yearlyProjectedRevenues:
              projectData.yearlyProjectedRevenues as YearlyBuildingsOperationsRevenues[],
          },
          completed: true,
        };
        break;
      case "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE":
        steps["URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE"] = {
          payload: {
            financialAssistanceRevenues:
              projectData.financialAssistanceRevenues as FinancialAssistanceRevenue[],
          },
          completed: true,
        };
        break;
      case "URBAN_PROJECT_SCHEDULE_PROJECTION":
        steps["URBAN_PROJECT_SCHEDULE_PROJECTION"] = {
          payload: {
            installationSchedule: projectData.developmentPlan.installationSchedule,
            reinstatementSchedule: projectData.reinstatementSchedule,
            firstYearOfOperation: projectData.operationsFirstYear,
          },
          completed: true,
        };
        break;
      case "URBAN_PROJECT_NAMING":
        steps["URBAN_PROJECT_NAMING"] = {
          payload: {
            name: projectData.name,
            description: projectData.description,
          },
          completed: true,
        };
        break;
      case "URBAN_PROJECT_PROJECT_PHASE":
        steps["URBAN_PROJECT_PROJECT_PHASE"] = {
          payload: {
            projectPhase: projectData.projectPhase as UrbanProjectPhase,
          },
          completed: true,
        };
        break;
    }
  });

  [...INTRODUCTION_STEPS, ...SUMMARY_STEPS].forEach((stepId) => {
    steps[stepId] = {
      completed: true,
    };
  });

  return steps;
};
