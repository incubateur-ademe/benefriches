import { useAppSelector } from "@/app/hooks/store.hooks";

import { HTML_MAIN_TITLE } from "../SiteCreationWizard";
import { renderStepView } from "../site-form/stepView.types";
import { useUrbanZoneSiteForm } from "../site-form/useUrbanZoneSiteForm";
import { urbanZoneStepToComponent } from "./stepToComponent";

function SiteCreationUrbanZoneStepContent() {
  const { selectCurrentStep } = useUrbanZoneSiteForm();
  const currentStep = useAppSelector(selectCurrentStep);
  return renderStepView(urbanZoneStepToComponent, currentStep, HTML_MAIN_TITLE);
}

export default SiteCreationUrbanZoneStepContent;
