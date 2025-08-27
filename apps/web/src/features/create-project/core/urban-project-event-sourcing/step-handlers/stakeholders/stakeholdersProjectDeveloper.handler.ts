import { AnswerStepHandler } from "../stepHandler.type";

export const StakeholdersProjectDeveloperHandler: AnswerStepHandler<"URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER"> =
  {
    stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",

    getPreviousStepId() {
      return "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION";
    },

    getNextStepId(context) {
      if (context.siteData?.nature === "FRICHE") {
        return "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER";
      }

      return "URBAN_PROJECT_SITE_RESALE_INTRODUCTION";
    },
  };
