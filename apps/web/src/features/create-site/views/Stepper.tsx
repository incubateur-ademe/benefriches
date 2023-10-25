import { Stepper } from "@codegouvfr/react-dsfr/Stepper";

import { SiteCreationStep } from "@/features/create-site/application/createSite.reducer";

const steps = [
  "Type de site",
  "Adresse",
  "Sols",
  "Pollution",
  "Gestion du site",
  "Dénomination",
] as const;

const getCurrentStep = (step: SiteCreationStep): string => {
  switch (step) {
    case SiteCreationStep.SITE_TYPE:
      return steps[0];
    case SiteCreationStep.ADDRESS:
      return steps[1];
    case SiteCreationStep.SOILS_INTRODUCTION:
    case SiteCreationStep.SOILS:
    case SiteCreationStep.SURFACE_AREA:
    case SiteCreationStep.SOILS_SURFACE_AREAS:
    case SiteCreationStep.SOILS_SUMMARY:
    case SiteCreationStep.SOILS_CARBON_SEQUESTRATION:
      return steps[2];
    case SiteCreationStep.SOIL_CONTAMINATION:
      return steps[3];
    case SiteCreationStep.MANAGEMENT_INTRODUCTION:
    case SiteCreationStep.OWNER:
    case SiteCreationStep.TENANT:
    case SiteCreationStep.RECENT_ACCIDENTS:
    case SiteCreationStep.FULL_TIME_JOBS_INVOLVED:
    case SiteCreationStep.FRICHE_SECURING_EXPENSES:
    case SiteCreationStep.YEARLY_EXPENSES:
    case SiteCreationStep.SOILS_DEGRADATION_YEARLY_EXPENSES:
    case SiteCreationStep.EXPENSES_SUMMARY:
      return steps[4];
    case SiteCreationStep.FRICHE_ACTIVITY:
    case SiteCreationStep.NAMING:
    case SiteCreationStep.CREATION_CONFIRMATION:
      return steps[5];
  }
};

type Props = {
  step: SiteCreationStep;
  isFriche?: boolean;
};

function SiteCreationStepper({ step, isFriche }: Props) {
  const currentStep = getCurrentStep(step);

  if (!currentStep) return null;

  const stepsToDisplay = isFriche
    ? steps
    : steps.filter((step) => step !== "Pollution");

  return (
    <Stepper
      title={currentStep}
      currentStep={steps.findIndex((step) => step === currentStep) + 1}
      stepCount={stepsToDisplay.length}
    />
  );
}

export default SiteCreationStepper;
