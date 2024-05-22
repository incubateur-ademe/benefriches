import { fr } from "@codegouvfr/react-dsfr";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";

import { SiteCreationStep } from "@/features/create-site/application/createSite.reducer";

const fricheStepsCategories = [
  "Type de site",
  "Adresse",
  "Sols",
  "Pollution",
  "Gestion du site",
  "Dénomination",
  "Récapitulatif",
] as const;

const siteStepsCategores = fricheStepsCategories.filter((step) => step !== "Pollution");

type StepCategory = (typeof fricheStepsCategories)[number];

const getCurrentStepCategory = (step: SiteCreationStep): StepCategory => {
  switch (step) {
    case "SITE_TYPE":
      return "Type de site";
    case "ADDRESS":
      return "Adresse";
    case "SOILS_INTRODUCTION":
    case "SOILS_SELECTION":
    case "SURFACE_AREA":
    case "SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE":
    case "SOILS_SURFACE_AREAS_DISTRIBUTION":
    case "SOILS_SUMMARY":
    case "SOILS_CARBON_STORAGE":
      return "Sols";
    case "SOILS_CONTAMINATION":
      return "Pollution";
    case "MANAGEMENT_INTRODUCTION":
    case "OWNER":
    case "IS_FRICHE_LEASED":
    case "IS_SITE_WORKED":
    case "OPERATOR":
    case "TENANT":
    case "FRICHE_RECENT_ACCIDENTS":
    case "FULL_TIME_JOBS_INVOLVED":
    case "YEARLY_EXPENSES":
    case "YEARLY_INCOME":
    case "YEARLY_EXPENSES_SUMMARY":
      return "Gestion du site";
    case "FRICHE_ACTIVITY":
    case "NAMING":
      return "Dénomination";
    case "FINAL_SUMMARY":
    case "CREATION_CONFIRMATION":
      return "Récapitulatif";
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
      className={fr.cx("fr-mb-7w")}
    />
  );
}

export default SiteCreationStepper;
