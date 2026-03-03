import { useAppSelector } from "@/app/hooks/store.hooks";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";
import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

import type { AllRenewableEnergyStep } from "../../core/renewable-energy/renewableEnergySteps";
import NavigationBlockerDialog from "../NavigationBlockerDialog";
import { HTML_MAIN_TITLE } from "../mainHtmlTitle";
import PhotovoltaicPowerStationStepper from "./PhotovoltaicPowerStationStepper";
import CreateModeSelectionForm from "./create-mode-selection";
import PhotovoltaicPowerStationCustomCreationWizard from "./custom-form";
import PhotovoltaicExpressCreationResult from "./express-form/PhotovoltaicExpressCreationResult";
import ProjectExpressSummary from "./express-form/PhotovoltaicExpressSummary";

type Props = {
  currentStep: AllRenewableEnergyStep;
};

export const HTML_PV_PROJECT_FORM_MAIN_TITLE = `Projet photovoltaïque - ${HTML_MAIN_TITLE}`;

function PhotovoltaicPowerStationCreationWizard({ currentStep }: Props) {
  const {
    createMode,
    saveState,
    currentStep: customCurrentStep,
  } = useAppSelector((state) => state.projectCreation.renewableEnergyProject);

  switch (createMode) {
    case undefined:
      return (
        <>
          <HtmlTitle>{`Mode de saisie - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <SidebarLayout
            mainChildren={<CreateModeSelectionForm />}
            title="Renseignement du projet"
            sidebarChildren={<PhotovoltaicPowerStationStepper step={currentStep} />}
          />
        </>
      );
    case "express":
      return (
        <>
          <HtmlTitle>{`Résultat - express - ${HTML_PV_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <SidebarLayout
            mainChildren={
              currentStep === "RENEWABLE_ENERGY_EXPRESS_FINAL_SUMMARY" ? (
                <>
                  <ProjectExpressSummary />
                  <NavigationBlockerDialog shouldBlock={true} />
                </>
              ) : (
                <PhotovoltaicExpressCreationResult />
              )
            }
            title="Renseignement du projet"
            sidebarChildren={
              <FormStepper
                currentStepIndex={2}
                steps={["Type de projet", "Mode de création", "Récapitulatif"]}
                isDone
              />
            }
          />
        </>
      );
    case "custom":
      return (
        <>
          <PhotovoltaicPowerStationCustomCreationWizard currentStep={customCurrentStep} />
          <NavigationBlockerDialog shouldBlock={saveState !== "success"} />
        </>
      );
  }
}

export default PhotovoltaicPowerStationCreationWizard;
