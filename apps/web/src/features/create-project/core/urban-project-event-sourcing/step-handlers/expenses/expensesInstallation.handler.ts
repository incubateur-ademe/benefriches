import { computeDefaultInstallationExpensesFromSiteSurfaceArea } from "shared";

import { FormState } from "../../form-state/formState";
import { AnswerStepHandler } from "../stepHandler.type";

export const UrbanProjectInstallationExpensesHandler: AnswerStepHandler<"URBAN_PROJECT_EXPENSES_INSTALLATION"> =
  {
    stepId: "URBAN_PROJECT_EXPENSES_INSTALLATION",

    getNextStepId(context) {
      if (
        FormState.hasBuildings(context.urbanProjectEventSourcing.events) &&
        !FormState.hasBuildingsResalePlannedAfterDevelopment(
          context.urbanProjectEventSourcing.events,
        )
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
  } as const;
