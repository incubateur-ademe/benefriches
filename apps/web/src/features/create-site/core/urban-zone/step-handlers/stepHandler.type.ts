import type { SoilsDistribution } from "shared";

import type { SiteCreationData } from "../../siteFoncier.types";
import type {
  AnswersByStep,
  SchematizedAnswerStepId,
  UrbanZoneIntroductionStep,
  UrbanZoneSiteCreationStep,
  UrbanZoneSummaryStep,
  UrbanZoneStepsState,
} from "../urbanZoneSteps";

type PartialLandParcel = {
  type: string;
  surfaceArea?: number;
  soilsDistribution?: SoilsDistribution;
  buildingsFloorSurfaceArea?: number;
};

export type UrbanZoneStepContext = {
  siteData: SiteCreationData;
  stepsState: UrbanZoneStepsState;
  landParcels: PartialLandParcel[];
  currentLandParcelIndex: number;
};

type StepHandler = {
  readonly stepId: UrbanZoneSiteCreationStep;
  getNextStepId?(context: UrbanZoneStepContext): UrbanZoneSiteCreationStep;
  getPreviousStepId?(context: UrbanZoneStepContext): UrbanZoneSiteCreationStep;
};

export type InfoStepHandler = StepHandler & {
  readonly stepId: UrbanZoneSummaryStep | UrbanZoneIntroductionStep;
};

type StepAnswerPayload<K extends SchematizedAnswerStepId = SchematizedAnswerStepId> = {
  [P in K]: { stepId: P; answers: AnswersByStep[P] };
}[K];

export type ShortcutResult = {
  complete: StepAnswerPayload[];
  next: UrbanZoneSiteCreationStep;
};

export type AnswerStepHandler<T extends SchematizedAnswerStepId> = Omit<
  StepHandler,
  "getNextStepId"
> & {
  readonly stepId: T;
  getNextStepId(
    context: UrbanZoneStepContext,
    answers?: AnswersByStep[T],
  ): UrbanZoneSiteCreationStep;
  getPreviousStepId?(context: UrbanZoneStepContext): UrbanZoneSiteCreationStep;
  getDefaultAnswers?(context: UrbanZoneStepContext): AnswersByStep[T] | undefined;
  getShortcut?(
    context: UrbanZoneStepContext,
    answers: AnswersByStep[T],
  ): ShortcutResult | undefined;
  updateAnswersMiddleware?(
    context: UrbanZoneStepContext,
    answers: AnswersByStep[T],
  ): AnswersByStep[T];
};
