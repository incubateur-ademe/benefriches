import {
  UrbanProjectCreationStep,
  UrbanProjectExpressCreationStep,
} from "@/features/create-project/core/urban-project/creationSteps";
import { selectCreateMode } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import UrbanProjectCreationStepper from "./Stepper";
import CreateModeSelectionForm from "./create-mode-selection";
import UrbanProjectCustomCreationStepWizardContainer from "./custom-forms";
import UrbanProjectExpressCreationStepWizard from "./express-forms";
import { HTML_URBAN_PROJECT_FORM_MAIN_TITLE } from "./htmlTitle";

type Props = {
  currentStep: UrbanProjectCreationStep;
};

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
      return <UrbanProjectCustomCreationStepWizardContainer />;
  }
}

export default UrbanProjectCreationWizard;
