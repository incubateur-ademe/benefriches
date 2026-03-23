import {
  willHaveBuildings,
  hasBuildingsResalePlannedAfterDevelopment,
} from "@/shared/core/reducers/project-form/urban-project/helpers/readers/buildingsReaders";
import { isSiteResalePlannedAfterDevelopment } from "@/shared/core/reducers/project-form/urban-project/helpers/readers/siteResaleReaders";

import type { InfoStepHandler } from "../../stepHandler.type";

export const RevenueIntroductionHandler = {
  stepId: "URBAN_PROJECT_REVENUE_INTRODUCTION",

  getPreviousStepId(context) {
    if (
      willHaveBuildings(context.stepsState) &&
      !hasBuildingsResalePlannedAfterDevelopment(context.stepsState)
    ) {
      return "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES";
    }
    return "URBAN_PROJECT_EXPENSES_INSTALLATION";
  },

  getNextStepId(context) {
    if (isSiteResalePlannedAfterDevelopment(context.stepsState)) {
      return "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE";
    }

    if (willHaveBuildings(context.stepsState)) {
      if (hasBuildingsResalePlannedAfterDevelopment(context.stepsState)) {
        return "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE";
      }
      return "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES";
    }

    return "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE";
  },
} satisfies InfoStepHandler;
