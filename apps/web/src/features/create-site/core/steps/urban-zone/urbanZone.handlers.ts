import type {
  CustomAnswerStepHandler,
  CustomInfoStepHandler,
} from "../../custom/stepHandlerRegistry";

// URBAN_ZONE_TYPE and URBAN_ZONE_LAND_PARCELS_INTRODUCTION are the two hand-off steps between
// the pre-engine site-nature selection and the urban-zone sub-flow's own step handler system
// (see core/urban-zone/). Both still live inside the custom registry — the actual cross-flow
// hand-off happens later, when SURFACE_AREA completes (see core/custom/customForm.reducer.ts).
export const urbanZoneHandoffHandlers = {
  answerSteps: {
    URBAN_ZONE_TYPE: {
      stepId: "URBAN_ZONE_TYPE",
      getNextStepId: () => "ADDRESS",
    } satisfies CustomAnswerStepHandler<"URBAN_ZONE_TYPE">,
  },
  infoSteps: {
    URBAN_ZONE_LAND_PARCELS_INTRODUCTION: {
      stepId: "URBAN_ZONE_LAND_PARCELS_INTRODUCTION",
      getNextStepId: () => "SURFACE_AREA",
    } satisfies CustomInfoStepHandler,
  },
};
