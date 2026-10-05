import type {
  FinancialAssistanceRevenue,
  PhotovoltaicInstallationExpense,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  SoilsDistribution,
  SoilType,
} from "shared";
import { canSiteAccomodatePhotovoltaicPanels } from "shared";

import { inferDecontaminationPlan } from "@/features/create-project/core/project-form/soilsDecontamination";
import type { ProjectStakeholder } from "@/features/create-project/core/project.types";
import { ReinstatementExpensesHandler } from "@/features/create-project/core/renewable-energy/step-handlers/expenses/expenses-reinstatement/expensesReinstatement.handler";
import type { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";

import type { UpdateProjectView } from "../updateProject.types";

const soilsDistributionArrayToObject = (
  soilsDistribution: UpdateProjectView["projectData"]["soilsDistribution"],
): SoilsDistribution => {
  const distribution: SoilsDistribution = {};
  for (const { soilType, surfaceArea } of soilsDistribution) {
    distribution[soilType] = (distribution[soilType] ?? 0) + surfaceArea;
  }
  return distribution;
};

export const convertPhotovoltaicProjectDataToSteps = ({
  projectData,
  siteData,
}: UpdateProjectView): RenewableEnergyStepsState => {
  const steps: RenewableEnergyStepsState = {};

  if (projectData.developmentPlan.type !== "PHOTOVOLTAIC_POWER_PLANT") {
    return steps;
  }

  const developmentPlan = projectData.developmentPlan;
  const { involvesReinstatement } = projectData;

  // The saved project always carries both the power and the surface, so which one the
  // user originally drove from is not recorded. Default to POWER, the wizard's own
  // default entry point; the other value is still pre-filled from the saved project.
  steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER = {
    completed: true,
    payload: { photovoltaicKeyParameter: "POWER" },
  };

  steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER = {
    completed: true,
    payload: {
      photovoltaicInstallationElectricalPowerKWc: developmentPlan.features.electricalPowerKWc,
    },
  };

  steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE = {
    completed: true,
    payload: {
      photovoltaicInstallationSurfaceSquareMeters: developmentPlan.features.surfaceArea,
    },
  };

  steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION = {
    completed: true,
    payload: {
      photovoltaicExpectedAnnualProduction: developmentPlan.features.expectedAnnualProduction,
    },
  };

  steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION = {
    completed: true,
    payload: { photovoltaicContractDuration: developmentPlan.features.contractDuration },
  };

  steps.RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT = {
    completed: true,
    payload: { involvesReinstatement },
  };

  // The wizard enters decontamination only when the site has contaminated soils, whatever its
  // nature (see InvolvesReinstatementHandler and ContractDurationHandler), independently of the
  // involvesReinstatement answer.
  if (siteData.hasContaminatedSoils) {
    // A missing saved surface is read as no decontamination.
    const decontaminatedSurfaceArea = projectData.decontaminatedSoilSurface ?? 0;

    steps.RENEWABLE_ENERGY_SOILS_DECONTAMINATION = {
      completed: true,
      payload: {
        decontaminationPlan: inferDecontaminationPlan(
          decontaminatedSurfaceArea,
          siteData.contaminatedSoilSurface ?? 0,
        ),
        decontaminatedSurfaceArea,
      },
    };
  }

  if (involvesReinstatement) {
    if (projectData.reinstatementContractOwner) {
      steps.RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER = {
        completed: true,
        // DTO stores the stakeholder's structureType as a plain string; it is always one
        // of ProjectStakeholderStructure's literals, mirroring urban's convertProjectDataToSteps.
        payload: {
          reinstatementContractOwner: projectData.reinstatementContractOwner as ProjectStakeholder,
        },
      };
    }

    steps.RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT = {
      completed: true,
      // DTO stores expense purposes as plain strings; they are always drawn from
      // ReinstatementExpensePurpose, mirroring urban's convertProjectDataToSteps.
      payload: {
        reinstatementExpenses: (projectData.reinstatementCosts ?? []) as ReinstatementExpense[],
      },
    };
  }

  // When the saved panel surface exceeds the site's suitable surface, the sequence walk
  // (SoilsTransformationIntroductionHandler.getNextStepId) routes through the two
  // non-suitable-soils steps. Hydration must complete them, otherwise the update starts
  // invalid on the first non-suitable screen. Fill them with no-op values only when the
  // walk needs them (i.e. only when the site cannot accommodate the panels), to avoid
  // leaving orphan data on projects that never route through them. The base distribution
  // is the site's own soils, which the always-custom transformation branch ignores anyway.
  if (
    !canSiteAccomodatePhotovoltaicPanels(
      siteData.soilsDistribution,
      developmentPlan.features.surfaceArea,
    )
  ) {
    steps.RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION = {
      completed: true,
      payload: { nonSuitableSoilsToTransform: [] },
    };
    steps.RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE = {
      completed: true,
      payload: {
        nonSuitableSoilsSurfaceAreaToTransform: {},
        baseSoilsDistributionForTransformation: siteData.soilsDistribution,
      },
    };
  }

  // The saved project only carries the resulting soils distribution, not which
  // transformation strategy produced it, so hydration always reconstructs the "custom"
  // branch: getProjectData reads the custom-allocation step first, so this stays
  // self-consistent for save.
  const soilsDistribution = soilsDistributionArrayToObject(projectData.soilsDistribution);
  // Object.keys widens to string[]; every key was inserted from a validated SoilType above.
  const soilTypes = Object.keys(soilsDistribution) as SoilType[];

  steps.RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION = {
    completed: true,
    payload: { soilsTransformationProject: "custom", soilsDistribution },
  };
  steps.RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION = {
    completed: true,
    payload: { futureSoilsSelection: soilTypes },
  };
  steps.RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION = {
    completed: true,
    payload: { soilsDistribution },
  };

  steps.RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER = {
    completed: true,
    // DTO stores the developer's structureType as a plain string; it is always one of
    // ProjectStakeholderStructure's literals, mirroring urban's convertProjectDataToSteps.
    payload: { projectDeveloper: developmentPlan.developer as ProjectStakeholder },
  };

  if (projectData.futureOperator) {
    steps.RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR = {
      completed: true,
      // DTO stores the stakeholder's structureType as a plain string; it is always one of
      // ProjectStakeholderStructure's literals, mirroring urban's convertProjectDataToSteps.
      payload: { futureOperator: projectData.futureOperator as ProjectStakeholder },
    };
  }

  const willSiteBePurchased = Boolean(projectData.sitePurchaseSellingPrice);
  steps.RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE = {
    completed: true,
    payload: { willSiteBePurchased },
  };

  if (willSiteBePurchased) {
    if (projectData.futureSiteOwner) {
      steps.RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER = {
        completed: true,
        // DTO stores the stakeholder's structureType as a plain string; it is always one of
        // ProjectStakeholderStructure's literals, mirroring urban's convertProjectDataToSteps.
        payload: { futureSiteOwner: projectData.futureSiteOwner as ProjectStakeholder },
      };
    }
    steps.RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS = {
      completed: true,
      payload: {
        sellingPrice: projectData.sitePurchaseSellingPrice ?? 0,
        propertyTransferDuties: projectData.sitePurchasePropertyTransferDuties,
      },
    };
  }

  steps.RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION = {
    completed: true,
    // DTO stores expense purposes as plain strings; they are always drawn from
    // PhotovoltaicInstallationExpense's purpose enum, mirroring urban's converter.
    payload: {
      photovoltaicPanelsInstallationExpenses:
        developmentPlan.costs as PhotovoltaicInstallationExpense[],
    },
  };

  steps.RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES = {
    completed: true,
    // DTO stores expense purposes as plain strings; always drawn from RecurringExpensePurpose.
    payload: { yearlyProjectedExpenses: projectData.yearlyProjectedCosts as RecurringExpense[] },
  };

  steps.RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE = {
    completed: true,
    // DTO stores revenue sources as plain strings; always drawn from RecurringRevenue's source enum.
    payload: { yearlyProjectedRevenues: projectData.yearlyProjectedRevenues as RecurringRevenue[] },
  };

  steps.RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE = {
    completed: true,
    // DTO stores revenue sources as plain strings; always drawn from FinancialAssistanceRevenue's source enum.
    payload: {
      financialAssistanceRevenues: (projectData.financialAssistanceRevenues ??
        []) as FinancialAssistanceRevenue[],
    },
  };

  steps.RENEWABLE_ENERGY_SCHEDULE_PROJECTION = {
    completed: true,
    payload: {
      photovoltaicInstallationSchedule: developmentPlan.installationSchedule,
      reinstatementSchedule: involvesReinstatement ? projectData.reinstatementSchedule : undefined,
      firstYearOfOperation: projectData.operationsFirstYear,
    },
  };

  steps.RENEWABLE_ENERGY_NAMING = {
    completed: true,
    payload: { name: projectData.name, description: projectData.description },
  };

  // The saved project does not record which reinstatement amounts were generated. Recomputing
  // them after an answer change (e.g. the decontaminated surface) only replaces the amounts equal
  // to the step's defaultValues, so rebuild those from the hydrated answers: a saved amount equal
  // to what the wizard generates counts as generated, any other amount as a user edit.
  const reinstatementExpensesStep = steps.RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT;
  if (reinstatementExpensesStep) {
    reinstatementExpensesStep.defaultValues = ReinstatementExpensesHandler.getDefaultAnswers?.({
      context: { siteData },
      answers: steps,
    });
  }

  return steps;
};
