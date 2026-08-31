import type { ComponentType, ReactElement } from "react";

import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";

export type StepView = {
  // Optional: one legacy switch branch (DEMO_SITE_ACTIVITY_SELECTION) rendered no HtmlTitle at
  // all — the browser tab keeps the previous step's title on that transition. Preserved verbatim
  // by omitting `htmlTitle` for that one entry instead of forcing a title on every step.
  htmlTitle?: string;
  Component: ComponentType;
};

export function renderStepView<StepId extends string>(
  map: Record<StepId, StepView>,
  stepId: StepId,
  mainTitle: string,
): ReactElement {
  const { htmlTitle, Component } = map[stepId];
  if (htmlTitle === undefined) {
    return <Component />;
  }
  return (
    <>
      <HtmlTitle>{`${htmlTitle} - ${mainTitle}`}</HtmlTitle>
      <Component />
    </>
  );
}
