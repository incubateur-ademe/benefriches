import type { CustomAnswerStepHandler } from "../../custom/stepHandlerRegistry";

export const addressHandlers = {
  ADDRESS: {
    stepId: "ADDRESS",
    getNextStepId: ({ context }) =>
      context.siteData.nature === "URBAN_ZONE"
        ? "URBAN_ZONE_LAND_PARCELS_INTRODUCTION"
        : "SPACES_INTRODUCTION",
  } satisfies CustomAnswerStepHandler<"ADDRESS">,
};
