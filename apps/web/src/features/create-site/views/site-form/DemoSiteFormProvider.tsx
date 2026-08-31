import React, { ReactNode, useCallback, useMemo } from "react";

import { useAppDispatch } from "@/app/hooks/store.hooks";
import type { StepCompletionPayload } from "@/features/create-site/core/demo/demo.actions";
import {
  nextStepRequested,
  previousStepRequested,
  stepCompletionRequested,
  stepNavigationRequested,
} from "@/features/create-site/core/demo/demoFactory";
import { creationDemoFormSelectors } from "@/features/create-site/core/demo/demoForm.selectors";
import { demoSiteSaved } from "@/features/create-site/core/demo/demoSiteSaved.action";
import type { DemoSiteCreationStep } from "@/features/create-site/core/demo/demoSteps";

import { DemoSiteFormContext, DemoSiteFormContextValue } from "./DemoSiteFormContext";

type Props = {
  children: ReactNode;
  mode: "create";
};

export const DemoSiteFormProvider: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();

  const onNext = useCallback(() => dispatch(nextStepRequested()), [dispatch]);

  const onBack = useCallback(() => dispatch(previousStepRequested()), [dispatch]);

  const onRequestStepCompletion = useCallback(
    (payload: StepCompletionPayload) => dispatch(stepCompletionRequested(payload)),
    [dispatch],
  );

  const onNavigateToStep = useCallback(
    (stepId: DemoSiteCreationStep) => dispatch(stepNavigationRequested({ stepId })),
    [dispatch],
  );

  const onSave = useCallback(() => {
    void dispatch(demoSiteSaved());
  }, [dispatch]);

  const value: DemoSiteFormContextValue = useMemo(
    () => ({
      ...creationDemoFormSelectors,
      onNext,
      onBack,
      onRequestStepCompletion,
      onNavigateToStep,
      onSave,
    }),
    [onNext, onBack, onRequestStepCompletion, onNavigateToStep, onSave],
  );

  return <DemoSiteFormContext.Provider value={value}>{children}</DemoSiteFormContext.Provider>;
};
