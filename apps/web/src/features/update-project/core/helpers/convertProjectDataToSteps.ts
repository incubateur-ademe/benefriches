import { sumListWithKey, typedObjectKeys } from "shared";
import type {
  UrbanProjectUse,
  FinancialAssistanceRevenue,
  ReinstatementExpense,
  UrbanProjectDevelopmentExpense,
} from "shared";

import { inferDecontaminationPlan } from "@/features/create-project/core/project-form/soilsDecontamination";
import type { ProjectStakeholder } from "@/features/create-project/core/project.types";
import { willReuseExistingBuildings } from "@/features/create-project/core/urban-project/step-handlers/buildings/buildingsReaders";
import { EXPENSE_PURPOSE_TO_FIELD } from "@/features/create-project/core/urban-project/step-handlers/expenses/expenses-buildings-construction-and-rehabilitation/expensesBuildingsConstructionAndRehabilitation.schema";
import { UrbanProjectReinstatementExpensesHandler } from "@/features/create-project/core/urban-project/step-handlers/expenses/expenses-reinstatement/expensesReinstatement.handler";
import { isDeveloperBuildingsConstructor } from "@/features/create-project/core/urban-project/step-handlers/stakeholders/stakeholdersReaders";
import type { UrbanProjectStepsState } from "@/features/create-project/core/urban-project/urbanProject.state";
import {
  ANSWER_STEPS,
  INTRODUCTION_STEPS,
  SUMMARY_STEPS,
} from "@/features/create-project/core/urban-project/urbanProjectSteps";

import type { UpdateProjectView } from "../updateProject.types";

export const convertProjectDataToSteps = ({ projectData, siteData }: UpdateProjectView) => {
  const steps: UrbanProjectStepsState = {};

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
      case "URBAN_PROJECT_INVOLVES_REINSTATEMENT":
        steps["URBAN_PROJECT_INVOLVES_REINSTATEMENT"] = {
          payload: { involvesReinstatement: projectData.involvesReinstatement },
          completed: true,
        };
        break;
      case "URBAN_PROJECT_SOILS_DECONTAMINATION":
        if (siteData.hasContaminatedSoils) {
          const decontaminatedSurfaceArea = projectData.decontaminatedSoilSurface ?? 0;
          steps["URBAN_PROJECT_SOILS_DECONTAMINATION"] = {
            payload: {
              decontaminationPlan: inferDecontaminationPlan(
                decontaminatedSurfaceArea,
                siteData.contaminatedSoilSurface ?? 0,
              ),
              decontaminatedSurfaceArea,
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
        if (siteData.nature === "FRICHE" && projectData.involvesReinstatement) {
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
        // Without reinstatement the step is out of the sequence (and deleted by the creation flow):
        // keeping a completed empty one would be skipped if the user later switches to true.
        if (projectData.involvesReinstatement) {
          steps["URBAN_PROJECT_EXPENSES_REINSTATEMENT"] = {
            payload: {
              reinstatementExpenses: projectData.reinstatementCosts as ReinstatementExpense[],
            },
            completed: true,
          };
        }
        break;
      case "URBAN_PROJECT_EXPENSES_INSTALLATION":
        steps["URBAN_PROJECT_EXPENSES_INSTALLATION"] = {
          payload: {
            installationExpenses: developmentPlan.costs as UrbanProjectDevelopmentExpense[],
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
      case "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE":
        if (projectData.buildingsFootprintToReuse !== undefined) {
          steps["URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE"] = {
            payload: { buildingsFootprintToReuse: projectData.buildingsFootprintToReuse },
            completed: true,
          };
        }
        break;
      case "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA":
        if (projectData.existingBuildingsUsesFloorSurfaceArea) {
          steps["URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA"] = {
            payload: {
              existingBuildingsUsesFloorSurfaceArea:
                projectData.existingBuildingsUsesFloorSurfaceArea,
            },
            completed: true,
          };
        }
        break;
      case "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA":
        if (projectData.newBuildingsUsesFloorSurfaceArea) {
          steps["URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA"] = {
            payload: {
              newBuildingsUsesFloorSurfaceArea: projectData.newBuildingsUsesFloorSurfaceArea,
            },
            completed: true,
          };
        }
        break;
      case "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER":
        if (projectData.developerWillBeBuildingsConstructor !== undefined) {
          steps["URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER"] = {
            payload: {
              developerWillBeBuildingsConstructor: projectData.developerWillBeBuildingsConstructor,
            },
            completed: true,
          };
        }
        break;
      case "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION": {
        // All fields are optional: no saved expense means the user went through the step without
        // entering amounts. Hydrate it (empty) whenever it is part of the sequence, otherwise it
        // would stay incomplete.
        // Reads `steps` mid-loop: relies on ANSWER_STEPS hydrating the developer and footprint steps first.
        const isInSequence =
          isDeveloperBuildingsConstructor(steps) || willReuseExistingBuildings(steps);
        const expenses = projectData.buildingsConstructionAndRehabilitationExpenses ?? [];
        if (expenses.length > 0 || isInSequence) {
          const expensesPayload: Record<string, number> = {};
          for (const { purpose, amount } of expenses) {
            const field = EXPENSE_PURPOSE_TO_FIELD[purpose];
            if (field) {
              expensesPayload[field] = amount;
            }
          }
          steps["URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION"] = {
            payload: expensesPayload,
            completed: true,
          };
        }
        break;
      }
    }
  });

  [...INTRODUCTION_STEPS, ...SUMMARY_STEPS].forEach((stepId) => {
    steps[stepId] = {
      completed: true,
    };
  });

  // The saved project does not record which reinstatement amounts were generated. Recomputing
  // them after an answer change (e.g. the decontaminated surface) only replaces the amounts equal
  // to the step's defaultValues, so rebuild those from the hydrated answers: a saved amount equal
  // to what the wizard generates counts as generated, any other amount as a user edit.
  const reinstatementExpensesStep = steps.URBAN_PROJECT_EXPENSES_REINSTATEMENT;
  if (reinstatementExpensesStep) {
    reinstatementExpensesStep.defaultValues =
      UrbanProjectReinstatementExpensesHandler.getDefaultAnswers({
        context: { siteData },
        answers: steps,
      });
  }

  return steps;
};
