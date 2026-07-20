import {
  FinancialAssistanceRevenue,
  PhotovoltaicInstallationExpense,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  SoilsDistribution,
  SoilType,
  computeDefaultDecontaminatedSurfaceArea,
} from "shared";

import { ProjectStakeholder } from "@/features/create-project/core/project.types";
import { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";

import { UpdateProjectView } from "../updateProject.types";

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

  // Decontamination is reached whenever the site is a friche (always, via the reinstatement
  // step) or carries a known contaminated surface — mirroring ContractDurationHandler and
  // urban's convertProjectDataToSteps site-nature gate. It is independent of the
  // involvesReinstatement answer itself, which the wizard still asks unconditionally on friches.
  if (siteData.nature === "FRICHE" || Boolean(siteData.contaminatedSoilSurface)) {
    const contaminatedSoilSurface = siteData.contaminatedSoilSurface ?? 0;
    const defaultDecontaminatedSurfaceArea =
      computeDefaultDecontaminatedSurfaceArea(contaminatedSoilSurface);
    const decontaminatedSurfaceArea = projectData.decontaminatedSoilSurface ?? 0;

    steps.RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION = {
      completed: true,
      payload: {
        decontaminationPlan:
          decontaminatedSurfaceArea === 0
            ? "none"
            : decontaminatedSurfaceArea === defaultDecontaminatedSurfaceArea
              ? "unknown"
              : "partial",
        decontaminatedSurfaceArea,
      },
    };

    if (
      decontaminatedSurfaceArea !== 0 &&
      decontaminatedSurfaceArea !== defaultDecontaminatedSurfaceArea
    ) {
      steps.RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA = {
        completed: true,
        payload: { decontaminatedSurfaceArea },
      };
    }
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

  return steps;
};
