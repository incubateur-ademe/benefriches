import { computeDefaultInstallationExpensesFromSiteSurfaceArea } from "shared";

import { willReuseExistingBuildings } from "@/features/create-project/core/urban-project/step-handlers/buildings/buildingsReaders";
import { isDeveloperBuildingsConstructor } from "@/features/create-project/core/urban-project/step-handlers/stakeholders/stakeholdersReaders";

import type { AnswerStepHandler } from "../../stepHandler.type";

export const UrbanProjectInstallationExpensesHandler = {
  stepId: "URBAN_PROJECT_EXPENSES_INSTALLATION",

  getNextStepId({ answers }) {
    if (isDeveloperBuildingsConstructor(answers) || willReuseExistingBuildings(answers)) {
      return "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION";
    }

    return "URBAN_PROJECT_REVENUE_INTRODUCTION";
  },

  getPreviousStepId({ context }) {
    return context?.siteData?.nature === "FRICHE"
      ? "URBAN_PROJECT_EXPENSES_REINSTATEMENT"
      : "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS";
  },

  getDefaultAnswers({ context }) {
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
