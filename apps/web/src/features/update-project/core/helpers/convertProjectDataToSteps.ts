import {
  FinancialAssistanceRevenue,
  getUrbanGreenSpaceFromSoilType,
  getUrbanPublicSpaceFromSoilType,
  ReinstatementExpense,
  sumListWithKey,
  sumObjectValues,
  typedObjectEntries,
  typedObjectKeys,
  UrbanProjectDevelopmentExpense,
  UrbanProjectPhase,
  YearlyBuildingsOperationsRevenues,
  YearlyBuildingsOperationsExpenses,
} from "shared";

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

  const spacesCategoriesDistribution = {
    PUBLIC_SPACES: sumListWithKey(
      projectData.soilsDistribution.filter(({ spaceCategory }) => spaceCategory === "PUBLIC_SPACE"),
      "surfaceArea",
    ),
    LIVING_AND_ACTIVITY_SPACES: sumListWithKey(
      projectData.soilsDistribution.filter(
        ({ spaceCategory }) => spaceCategory === "LIVING_AND_ACTIVITY_SPACE",
      ),
      "surfaceArea",
    ),
    GREEN_SPACES: sumListWithKey(
      projectData.soilsDistribution.filter(
        ({ spaceCategory }) => spaceCategory === "PUBLIC_GREEN_SPACE",
      ),
      "surfaceArea",
    ),
  };
  const developmentPlan = projectData.developmentPlan;

  const hasBuildings =
    typedObjectKeys(developmentPlan.features.buildingsFloorAreaDistribution).length > 0;

  ANSWER_STEPS.forEach((stepId) => {
    switch (stepId) {
      case "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION":
        steps["URBAN_PROJECT_SPACES_CATEGORIES_SELECTION"] = {
          payload: {
            spacesCategories: typedObjectEntries(spacesCategoriesDistribution)
              .filter(([, surfaceArea]) => surfaceArea > 0)
              .map(([spaceType]) => spaceType),
          },
          completed: true,
        };
        break;
      case "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA":
        steps["URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA"] = {
          payload: {
            spacesCategoriesDistribution: spacesCategoriesDistribution,
          },
          completed: true,
        };
        break;
      case "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION":
        steps["URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION"] = {
          payload: {
            greenSpacesDistribution: Object.fromEntries(
              projectData.soilsDistribution
                .filter(({ spaceCategory }) => spaceCategory === "PUBLIC_GREEN_SPACE")
                .map(({ soilType, surfaceArea }) => [
                  getUrbanGreenSpaceFromSoilType(soilType),
                  surfaceArea,
                ]),
            ),
          },
          completed: true,
        };
        break;
      case "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION":
        steps["URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION"] = {
          payload: {
            livingAndActivitySpacesDistribution: {
              BUILDINGS: sumListWithKey(
                projectData.soilsDistribution.filter(
                  ({ spaceCategory, soilType }) =>
                    spaceCategory === "LIVING_AND_ACTIVITY_SPACE" && soilType === "BUILDINGS",
                ),
                "surfaceArea",
              ),
              IMPERMEABLE_SURFACE: sumListWithKey(
                projectData.soilsDistribution.filter(
                  ({ spaceCategory, soilType }) =>
                    spaceCategory === "LIVING_AND_ACTIVITY_SPACE" &&
                    soilType === "IMPERMEABLE_SOILS",
                ),
                "surfaceArea",
              ),
              PERMEABLE_SURFACE: sumListWithKey(
                projectData.soilsDistribution.filter(
                  ({ spaceCategory, soilType }) =>
                    spaceCategory === "LIVING_AND_ACTIVITY_SPACE" && soilType === "MINERAL_SOIL",
                ),
                "surfaceArea",
              ),
              PRIVATE_GREEN_SPACES: sumListWithKey(
                projectData.soilsDistribution.filter(
                  ({ spaceCategory, soilType }) =>
                    spaceCategory === "LIVING_AND_ACTIVITY_SPACE" &&
                    [
                      "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
                      "ARTIFICIAL_TREE_FILLED",
                      "WATER",
                    ].includes(soilType),
                ),
                "surfaceArea",
              ),
            },
          },
          completed: true,
        };
        break;
      case "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION":
        steps["URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION"] = {
          payload: {
            publicSpacesDistribution: Object.fromEntries(
              projectData.soilsDistribution
                .filter(({ spaceCategory }) => spaceCategory === "PUBLIC_SPACE")
                .map(({ soilType, surfaceArea }) => [
                  getUrbanPublicSpaceFromSoilType(soilType),
                  surfaceArea,
                ]),
            ),
          },
          completed: true,
        };
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

      case "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA":
        if (hasBuildings) {
          steps["URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA"] = {
            payload: {
              buildingsFloorSurfaceArea: sumObjectValues(
                developmentPlan.features.buildingsFloorAreaDistribution,
              ),
            },
            completed: true,
          };
        }

        break;
      case "URBAN_PROJECT_BUILDINGS_USE_SELECTION":
        if (hasBuildings) {
          steps["URBAN_PROJECT_BUILDINGS_USE_SELECTION"] = {
            payload: {
              buildingsUsesSelection: typedObjectKeys(
                developmentPlan.features.buildingsFloorAreaDistribution,
              ),
            },
            completed: true,
          };
        }
        break;
      case "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION":
        if (hasBuildings) {
          steps["URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION"] = {
            payload: {
              buildingsUsesDistribution: developmentPlan.features.buildingsFloorAreaDistribution,
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
            siteResalePlannedAfterDevelopment: Boolean(projectData.siteResaleExpectedSellingPrice),
            futureSiteOwner: projectData.futureSiteOwner as ProjectStakeholder,
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
