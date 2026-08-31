import type { CustomAnswerStepHandler } from "../../custom/stepHandlerRegistry";

export const siteManagementHandlers = {
  OWNER: {
    stepId: "OWNER",
    getNextStepId: ({ context }) => {
      switch (context.siteData.nature) {
        case "FRICHE":
          return "IS_FRICHE_LEASED";
        case "AGRICULTURAL_OPERATION":
          return "IS_SITE_OPERATED";
        case "NATURAL_AREA":
          return "NAMING_INTRODUCTION";
        default:
          // Unreachable for the custom flow's natures — URBAN_ZONE never reaches OWNER (it
          // hands off to the urban-zone sub-flow at SURFACE_AREA).
          return "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION";
      }
    },
  } satisfies CustomAnswerStepHandler<"OWNER">,

  IS_FRICHE_LEASED: {
    stepId: "IS_FRICHE_LEASED",
    getNextStepId: (_params, answers) =>
      answers?.isFricheLeased ? "TENANT" : "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION",
  } satisfies CustomAnswerStepHandler<"IS_FRICHE_LEASED">,

  IS_SITE_OPERATED: {
    stepId: "IS_SITE_OPERATED",
    getNextStepId: (_params, answers) =>
      answers?.isSiteOperated ? "OPERATOR" : "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION",
  } satisfies CustomAnswerStepHandler<"IS_SITE_OPERATED">,

  TENANT: {
    stepId: "TENANT",
    getNextStepId: () => "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION",
  } satisfies CustomAnswerStepHandler<"TENANT">,

  OPERATOR: {
    stepId: "OPERATOR",
    getNextStepId: () => "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION",
  } satisfies CustomAnswerStepHandler<"OPERATOR">,

  YEARLY_EXPENSES: {
    stepId: "YEARLY_EXPENSES",
    getNextStepId: ({ context }) =>
      context.siteData.isSiteOperated ? "YEARLY_INCOME" : "YEARLY_EXPENSES_SUMMARY",
  } satisfies CustomAnswerStepHandler<"YEARLY_EXPENSES">,

  YEARLY_INCOME: {
    stepId: "YEARLY_INCOME",
    getNextStepId: () => "YEARLY_EXPENSES_SUMMARY",
  } satisfies CustomAnswerStepHandler<"YEARLY_INCOME">,
};
