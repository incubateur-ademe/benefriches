import { useAppSelector } from "@/app/hooks/store.hooks";

import NavigationBlockerDialog from "../navigation-blocker/NavigationBlockerDialog";
import { useDemoSiteForm } from "../site-form/useDemoSiteForm";
import DemoSiteCreationStepContent from "./StepContent";

function DemoSiteCreationStepContentWizard() {
  const { selectCurrentStep, selectSaveState } = useDemoSiteForm();
  const currentStep = useAppSelector(selectCurrentStep);
  const saveState = useAppSelector(selectSaveState);

  return (
    <>
      <NavigationBlockerDialog saveState={saveState} />
      <DemoSiteCreationStepContent currentStep={currentStep} />
    </>
  );
}

export default DemoSiteCreationStepContentWizard;
