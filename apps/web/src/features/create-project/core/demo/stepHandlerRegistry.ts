import type {
  AnswerStepHandler as GenericAnswerStepHandler,
  AnswerStepHandlerMap as GenericAnswerStepHandlerMap,
  InfoStepHandler as GenericInfoStepHandler,
  ShortcutResult as GenericShortcutResult,
  NavigationHandlerRegistry,
  StepContext,
} from "@/shared/core/reducers/form-factory/handlerRegistry.types";

import { ProjectCreationState } from "../createProject.reducer";
import type {
  SchematizedAnswerStepId,
  DemoProjectCreationStep,
  answersByStepSchemas,
  DemoSummaryStep,
} from "./demoSteps";

export type DemoStepContext = StepContext<
  typeof answersByStepSchemas,
  ProjectCreationState["siteData"]
>;

export type DemoAnswerStepHandler<K extends SchematizedAnswerStepId> = GenericAnswerStepHandler<
  typeof answersByStepSchemas,
  DemoProjectCreationStep,
  DemoStepContext,
  K
>;

export type InfoStepHandler = GenericInfoStepHandler<
  never,
  DemoSummaryStep,
  SchematizedAnswerStepId,
  DemoStepContext
>;

export type ShortcutResult = GenericShortcutResult<
  typeof answersByStepSchemas,
  DemoProjectCreationStep
>;

export type AnswerStepHandlerMap = GenericAnswerStepHandlerMap<
  typeof answersByStepSchemas,
  DemoProjectCreationStep,
  DemoStepContext
>;

export const answerStepHandlers: Partial<AnswerStepHandlerMap> = {
  DEMO_PROJECT_TEMPLATE_SELECTION: {
    stepId: "DEMO_PROJECT_TEMPLATE_SELECTION",

    getNextStepId() {
      return "DEMO_PROJECT_SUMMARY";
    },
  } satisfies DemoAnswerStepHandler<"DEMO_PROJECT_TEMPLATE_SELECTION">,
};

export type DemoStepHandlerRegistry = NavigationHandlerRegistry<
  DemoProjectCreationStep,
  DemoStepContext
>;

export const demoStepHandlerRegistry: DemoStepHandlerRegistry = {
  ...answerStepHandlers,
  DEMO_PROJECT_SUMMARY: {
    stepId: "DEMO_PROJECT_SUMMARY",

    getNextStepId() {
      return "DEMO_PROJECT_CREATION_RESULT";
    },

    getPreviousStepId() {
      return "DEMO_PROJECT_TEMPLATE_SELECTION";
    },
  } satisfies InfoStepHandler,
  DEMO_PROJECT_CREATION_RESULT: {
    stepId: "DEMO_PROJECT_CREATION_RESULT",

    getPreviousStepId() {
      return "DEMO_PROJECT_SUMMARY";
    },
  } satisfies InfoStepHandler,
};
