import { useAppSelector } from "@/app/hooks/store.hooks";

import { selectDemoUseCaseContentWizardViewData } from "../../core/demo/demo.selectors";
import NavigationBlockerDialog from "../navigation-blocker/NavigationBlockerDialog";
import DemoSiteCreationStepContent from "./StepContent";

function DemoSiteCreationStepContentWizard() {
  const { saveState, currentStep } = useAppSelector(selectDemoUseCaseContentWizardViewData);

  return (
    <>
      <NavigationBlockerDialog saveState={saveState} />
      <DemoSiteCreationStepContent currentStep={currentStep} />
    </>
  );
}

export default DemoSiteCreationStepContentWizard;
