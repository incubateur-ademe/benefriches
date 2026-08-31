import { useAppSelector } from "@/app/hooks/store.hooks";

import { HTML_MAIN_TITLE } from "../SiteCreationWizard";
import { renderStepView } from "../site-form/stepView.types";
import { useCustomSiteForm } from "../site-form/useCustomSiteForm";
import { customStepToComponent } from "./stepToComponent";

function SiteCreationCustomStepContent() {
  const { selectCurrentStep } = useCustomSiteForm();
  const currentStep = useAppSelector(selectCurrentStep);
  return renderStepView(customStepToComponent, currentStep, HTML_MAIN_TITLE);
}

export default SiteCreationCustomStepContent;
