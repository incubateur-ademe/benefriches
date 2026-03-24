import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";

import { DemoSiteCreationStep } from "../../core/demo/demoSteps";
import { HTML_MAIN_TITLE } from "../SiteCreationWizard";
import AddressForm from "./address";
import DemoSiteIntroductionContainer from "./introduction";
import DemoSiteCreationResultContainer from "./result";
import SiteActivitySelectionFormContainer from "./site-activity";
import SiteNatureFormContainer from "./site-nature";
import SiteSurfaceAreaForm from "./surface-area";

type Props = { currentStep: DemoSiteCreationStep };

function DemoSiteCreationStepContent({ currentStep }: Props) {
  switch (currentStep) {
    case "DEMO_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <DemoSiteIntroductionContainer />
        </>
      );
    case "DEMO_SITE_NATURE_SELECTION":
      return (
        <>
          <HtmlTitle>{`Type de site - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteNatureFormContainer />
        </>
      );
    case "DEMO_SITE_ADDRESS":
      return (
        <>
          <HtmlTitle>{`Adresse - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <AddressForm />
        </>
      );
    case "DEMO_SITE_SURFACE_AREA":
      return (
        <>
          <HtmlTitle>{`Surface du site - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteSurfaceAreaForm />
        </>
      );
    case "DEMO_SITE_ACTIVITY_SELECTION":
      return <SiteActivitySelectionFormContainer />;

    case "DEMO_CREATION_RESULT":
      return (
        <>
          <HtmlTitle>{`Résultat - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <DemoSiteCreationResultContainer />
        </>
      );
  }
}

export default DemoSiteCreationStepContent;
