import type { DemoSiteCreationStep } from "../../core/demo/demoSteps";
import { HTML_MAIN_TITLE } from "../SiteCreationWizard";
import { renderStepView } from "../site-form/stepView.types";
import { demoStepToComponent } from "./stepToComponent";

type Props = { currentStep: DemoSiteCreationStep };

function DemoSiteCreationStepContent({ currentStep }: Props) {
  return renderStepView(demoStepToComponent, currentStep, HTML_MAIN_TITLE);
}

export default DemoSiteCreationStepContent;
