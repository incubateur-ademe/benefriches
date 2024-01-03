import { Stepper } from "@codegouvfr/react-dsfr/Stepper";

import { SiteCreationStep } from "@/features/create-site/application/createSite.reducer";

const fricheStepsCategories = [
  "Type de site",
  "Adresse",
  "Sols",
  "Pollution",
  "Gestion du site",
  "Dénomination",
] as const;

const siteStepsCategores = fricheStepsCategories.filter((step) => step !== "Pollution");

type StepCategory = (typeof fricheStepsCategories)[number];

const getCurrentStepCategory = (step: SiteCreationStep): StepCategory => {
  switch (step) {
    case SiteCreationStep.SITE_TYPE:
      return "Type de site";
    case SiteCreationStep.ADDRESS:
      return "Adresse";
    case SiteCreationStep.SOILS_INTRODUCTION:
    case SiteCreationStep.SOILS:
    case SiteCreationStep.SURFACE_AREA:
    case SiteCreationStep.SOILS_SURFACE_AREAS:
    case SiteCreationStep.SOILS_SUMMARY:
    case SiteCreationStep.SOILS_CARBON_STORAGE:
      return "Sols";
    case SiteCreationStep.SOIL_CONTAMINATION:
      return "Pollution";
    case SiteCreationStep.MANAGEMENT_INTRODUCTION:
    case SiteCreationStep.OWNER:
    case SiteCreationStep.TENANT:
    case SiteCreationStep.RECENT_ACCIDENTS:
    case SiteCreationStep.FULL_TIME_JOBS_INVOLVED:
    case SiteCreationStep.FRICHE_SECURING_EXPENSES:
    case SiteCreationStep.YEARLY_EXPENSES:
    case SiteCreationStep.YEARLY_INCOME:
    case SiteCreationStep.EXPENSES_SUMMARY:
      return "Gestion du site";
    case SiteCreationStep.FRICHE_ACTIVITY:
    case SiteCreationStep.NAMING:
    case SiteCreationStep.CREATION_CONFIRMATION:
      return "Dénomination";
  }
};

type Props = {
  step: SiteCreationStep;
  isFriche?: boolean;
};

function SiteCreationStepper({ step, isFriche }: Props) {
  const currentStepCategory = getCurrentStepCategory(step);

  const stepsCategories = isFriche ? fricheStepsCategories : siteStepsCategores;

  return (
    <Stepper
      title={currentStepCategory}
      currentStep={stepsCategories.findIndex((step) => step === currentStepCategory) + 1}
      stepCount={stepsCategories.length}
    />
  );
}

export default SiteCreationStepper;
