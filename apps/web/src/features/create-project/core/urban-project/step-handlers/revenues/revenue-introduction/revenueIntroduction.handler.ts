import { isSiteResalePlannedAfterDevelopment } from "@/features/create-project/core/urban-project/helpers/readers/siteResaleReaders";
import {
  isDeveloperBuildingsConstructor,
  willDeveloperResellBuildings,
} from "@/features/create-project/core/urban-project/step-handlers/stakeholders/stakeholdersReaders";

import type { InfoStepHandler } from "../../stepHandler.type";

export const RevenueIntroductionHandler = {
  stepId: "URBAN_PROJECT_REVENUE_INTRODUCTION",

  getPreviousStepId({ answers }) {
    if (isDeveloperBuildingsConstructor(answers)) {
      return "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION";
    }

    return "URBAN_PROJECT_EXPENSES_INSTALLATION";
  },

  getNextStepId({ answers }) {
    if (isSiteResalePlannedAfterDevelopment(answers)) {
      return "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE";
    }

    if (willDeveloperResellBuildings(answers)) {
      return "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE";
    }

    return "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE";
  },
} satisfies InfoStepHandler;
