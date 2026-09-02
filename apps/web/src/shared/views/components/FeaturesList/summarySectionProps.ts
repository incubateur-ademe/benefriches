import { ButtonProps } from "@codegouvfr/react-dsfr/Button";

export const WARNING_TEXT = "Cette étape est incomplète. Veuillez la compléter.";

type SectionStep<TStepId> = {
  stepId: TStepId;
  isStepCompleted: boolean;
};

type SummarySectionProps = {
  warning?: string;
  buttonProps?: ButtonProps;
};

/**
 * Builds the `Section` header props (a "Modifier" button navigating to the first incomplete
 * step, plus a warning when one exists) from a summary section's flattened step list. Mirrors
 * `UrbanProjectFormSummary`'s previously-inline `getSectionProps`, so every summary (project,
 * custom site, urban-zone site) renders this affordance identically.
 *
 * Returns `{}` (no button, no warning) when `steps` is empty — the section is not part of the
 * walked step sequence, so there is nothing to navigate to.
 */
export const getSummarySectionProps = <TStepId>(
  steps: SectionStep<TStepId>[],
  onNavigateToStep: (stepId: TStepId) => void,
): SummarySectionProps => {
  const firstUnfilledStep = steps.find(({ isStepCompleted }) => !isStepCompleted)?.stepId;
  const targetStep = firstUnfilledStep ?? steps[0]?.stepId;

  if (targetStep === undefined) {
    return {};
  }

  return {
    warning: firstUnfilledStep !== undefined ? WARNING_TEXT : undefined,
    buttonProps: {
      iconId: "fr-icon-pencil-line",
      children: "Modifier",
      onClick: () => {
        onNavigateToStep(targetStep);
      },
    },
  };
};
