import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";
import FormStepper from "@/shared/views/layout/WizardFormLayout/FormStepper";

import {
  RenewableEnergyCreationStep,
  RenewableEnergyCustomCreationStep,
} from "../../core/renewable-energy/creationSteps";
import { HTML_MAIN_TITLE } from "../mainHtmlTitle";
import PhotovoltaicPowerStationStepper from "./PhotovoltaicPowerStationStepper";
import CreateModeSelectionForm from "./create-mode-selection";
import PhotovoltaicPowerStationCustomCreationWizard from "./custom-form";
import PhotovoltaicExpressCreationResult from "./express-form/PhotovoltaicExpressCreationResult";

type Props = {
  currentStep: RenewableEnergyCreationStep;
};

export const HTML_PV_PROJECT_FORM_MAIN_TITLE = `Projet photovoltaïque - ${HTML_MAIN_TITLE}`;

function PhotovoltaicPowerStationCreationWizard({ currentStep }: Props) {
  const createMode = useAppSelector(
    (state) => state.projectCreation.renewableEnergyProject.createMode,
  );

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
            mainChildren={<PhotovoltaicExpressCreationResult />}
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
        <PhotovoltaicPowerStationCustomCreationWizard
          currentStep={currentStep as RenewableEnergyCustomCreationStep}
        />
      );
  }
}

export default PhotovoltaicPowerStationCreationWizard;
