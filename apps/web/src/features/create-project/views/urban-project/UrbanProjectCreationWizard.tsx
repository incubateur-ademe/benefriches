import {
  UrbanProjectCreationStep,
  UrbanProjectCustomCreationStep,
  UrbanProjectExpressCreationStep,
} from "@/features/create-project/core/urban-project/creationSteps";
import { selectCreateMode } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import { HTML_MAIN_TITLE } from "../mainHtmlTitle";
import UrbanProjectCreationStepper from "./Stepper";
import CreateModeSelectionForm from "./create-mode-selection";
import UrbanProjectCustomCreationStepWizard from "./custom-forms";
import UrbanProjectExpressCreationStepWizard from "./express-forms";

type Props = {
  currentStep: UrbanProjectCreationStep;
};

export const HTML_URBAN_PROJECT_FORM_MAIN_TITLE = `Projet urbain - ${HTML_MAIN_TITLE}`;

function UrbanProjectCreationWizard({ currentStep }: Props) {
  const createMode = useAppSelector(selectCreateMode);

  switch (createMode) {
    case undefined:
      return (
        <>
          <HtmlTitle>{`Mode de saisie - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <SidebarLayout
            mainChildren={<CreateModeSelectionForm />}
            title="Renseignement du projet"
            sidebarChildren={<UrbanProjectCreationStepper step={currentStep} />}
          />
        </>
      );
    case "express":
      return (
        <UrbanProjectExpressCreationStepWizard
          currentStep={currentStep as UrbanProjectExpressCreationStep}
        />
      );
    case "custom":
      return (
        <UrbanProjectCustomCreationStepWizard
          currentStep={currentStep as UrbanProjectCustomCreationStep}
        />
      );
  }
}

export default UrbanProjectCreationWizard;
