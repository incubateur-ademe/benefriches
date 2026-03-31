import { computeDefaultInstallationExpensesFromSiteSurfaceArea } from "shared";

import {
  hasBuildingsResalePlannedAfterDevelopment,
  willHaveBuildings,
} from "@/shared/core/reducers/project-form/urban-project/helpers/readers/buildingsReaders";
import { willReuseExistingBuildings } from "@/shared/core/reducers/project-form/urban-project/step-handlers/buildings/buildingsReaders";
import { isDeveloperBuildingsConstructor } from "@/shared/core/reducers/project-form/urban-project/step-handlers/stakeholders/stakeholdersReaders";

import type { AnswerStepHandler } from "../../stepHandler.type";

export const UrbanProjectInstallationExpensesHandler = {
  stepId: "URBAN_PROJECT_EXPENSES_INSTALLATION",

  getNextStepId(context) {
    if (
      isDeveloperBuildingsConstructor(context.stepsState) ||
      willReuseExistingBuildings(context.stepsState)
    ) {
      return "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION";
    }

    if (
      willHaveBuildings(context.stepsState) &&
      !hasBuildingsResalePlannedAfterDevelopment(context.stepsState)
    ) {
      return "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES";
    }
    return "URBAN_PROJECT_REVENUE_INTRODUCTION";
  },

  getPreviousStepId(context) {
    return context.siteData?.nature === "FRICHE"
      ? "URBAN_PROJECT_EXPENSES_REINSTATEMENT"
      : "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS";
  },

  getDefaultAnswers(context) {
    if (!context.siteData?.surfaceArea) {
      return undefined;
    }
    const { technicalStudies, other, developmentWorks } =
      computeDefaultInstallationExpensesFromSiteSurfaceArea(context.siteData.surfaceArea);

    return {
      installationExpenses: [
        { purpose: "development_works", amount: developmentWorks },
        { purpose: "technical_studies", amount: technicalStudies },
        { purpose: "other", amount: other },
      ],
    };
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_EXPENSES_INSTALLATION">;
