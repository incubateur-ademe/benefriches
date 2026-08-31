import type { DemoSiteCreationStep } from "@/features/create-site/core/demo/demoSteps";

import type { StepView } from "../site-form/stepView.types";
import AddressForm from "./address";
import DemoSiteIntroductionContainer from "./introduction";
import DemoSiteCreationResultContainer from "./result";
import SiteActivitySelectionFormContainer from "./site-activity";
import SiteNatureFormContainer from "./site-nature";
import SiteSurfaceAreaForm from "./surface-area";

export const demoStepToComponent: Record<DemoSiteCreationStep, StepView> = {
  DEMO_INTRODUCTION: { htmlTitle: "Introduction", Component: DemoSiteIntroductionContainer },
  DEMO_SITE_NATURE_SELECTION: { htmlTitle: "Type de site", Component: SiteNatureFormContainer },
  DEMO_SITE_ADDRESS: { htmlTitle: "Adresse", Component: AddressForm },
  DEMO_SITE_SURFACE_AREA: { htmlTitle: "Surface du site", Component: SiteSurfaceAreaForm },
  // No HtmlTitle in the original switch for this step — the browser tab keeps the previous
  // step's title on this transition (see stepView.types.tsx).
  DEMO_SITE_ACTIVITY_SELECTION: {
    Component: SiteActivitySelectionFormContainer,
  },
  DEMO_CREATION_RESULT: { htmlTitle: "Résultat", Component: DemoSiteCreationResultContainer },
};
