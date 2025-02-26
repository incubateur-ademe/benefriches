import { SiteCreationCustomStep } from "@/features/create-site/core/createSite.reducer";
import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

const fricheStepsCategories = [
  "Type de site",
  "Adresse",
  "Sols",
  "Pollution et accidents",
  "Gestion du site",
  "Dénomination",
  "Récapitulatif",
] as const;

const siteStepsCategories = fricheStepsCategories.filter(
  (step) => step !== "Pollution et accidents",
);

type StepCategory = (typeof fricheStepsCategories)[number];

const getCurrentStepCategory = (step: SiteCreationCustomStep): StepCategory => {
  switch (step) {
    case "IS_FRICHE":
    case "FRICHE_ACTIVITY":
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
    case "SOILS_CONTAMINATION_INTRODUCTION":
    case "SOILS_CONTAMINATION":
    case "FRICHE_ACCIDENTS_INTRODUCTION":
    case "FRICHE_ACCIDENTS":
      return "Pollution et accidents";
    case "MANAGEMENT_INTRODUCTION":
    case "OWNER":
    case "IS_FRICHE_LEASED":
    case "IS_SITE_OPERATED":
    case "OPERATOR":
    case "TENANT":
    case "YEARLY_EXPENSES":
    case "YEARLY_INCOME":
    case "YEARLY_EXPENSES_SUMMARY":
      return "Gestion du site";
    case "NAMING_INTRODUCTION":
    case "NAMING":
      return "Dénomination";
    case "FINAL_SUMMARY":
    case "CREATION_RESULT":
      return "Récapitulatif";
  }
};

type Props = {
  step: SiteCreationCustomStep;
  isFriche?: boolean;
};

function SiteCreationCustomStepper({ step, isFriche }: Props) {
  const currentStepCategory = getCurrentStepCategory(step);

  const stepsCategories = isFriche ? fricheStepsCategories : siteStepsCategories;
  const currentStepIndex = stepsCategories.findIndex((step) => step === currentStepCategory);

  return (
    <FormStepper
      currentStepIndex={currentStepIndex}
      steps={stepsCategories as string[]}
      isDone={step === "CREATION_RESULT"}
    />
  );
}

export default SiteCreationCustomStepper;
