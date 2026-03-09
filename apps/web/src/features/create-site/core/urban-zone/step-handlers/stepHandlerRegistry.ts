import type { SchematizedAnswerStepId, UrbanZoneSiteCreationStep } from "../urbanZoneSteps";
import type { AnswerStepHandler, InfoStepHandler } from "./stepHandler.type";

export type UrbanZoneStepHandlerRegistry = Partial<
  Record<UrbanZoneSiteCreationStep, InfoStepHandler | AnswerStepHandler<SchematizedAnswerStepId>>
>;

// Step handlers are registered here as each phase is implemented (Phase 3+)
export const urbanZoneStepHandlerRegistry: UrbanZoneStepHandlerRegistry = {};
