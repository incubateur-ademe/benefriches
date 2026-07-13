import {
  willHaveBuildings,
  hasBuildingsResalePlannedAfterDevelopment,
} from "@/shared/core/wizard-form/urban-project/helpers/readers/buildingsReaders";
import { isSiteResalePlannedAfterDevelopment } from "@/shared/core/wizard-form/urban-project/helpers/readers/siteResaleReaders";
import { willReuseExistingBuildings } from "@/shared/core/wizard-form/urban-project/step-handlers/buildings/buildingsReaders";
import { isDeveloperBuildingsConstructor } from "@/shared/core/wizard-form/urban-project/step-handlers/stakeholders/stakeholdersReaders";

import type { InfoStepHandler } from "../../stepHandler.type";

export const RevenueIntroductionHandler = {
  stepId: "URBAN_PROJECT_REVENUE_INTRODUCTION",

  getPreviousStepId({ answers }) {
    if (willHaveBuildings(answers) && !hasBuildingsResalePlannedAfterDevelopment(answers)) {
      return "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES";
    }

    if (isDeveloperBuildingsConstructor(answers) || willReuseExistingBuildings(answers)) {
      return "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION";
    }

    return "URBAN_PROJECT_EXPENSES_INSTALLATION";
  },

  getNextStepId({ answers }) {
    if (isSiteResalePlannedAfterDevelopment(answers)) {
      return "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE";
    }

    if (willHaveBuildings(answers)) {
      if (hasBuildingsResalePlannedAfterDevelopment(answers)) {
        return "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE";
      }
      return "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES";
    }

    return "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE";
  },
} satisfies InfoStepHandler;
