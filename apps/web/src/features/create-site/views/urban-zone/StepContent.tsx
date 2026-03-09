import { useAppSelector } from "@/app/hooks/store.hooks";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";

import { selectCurrentStep } from "../../core/createSite.reducer";
import { HTML_MAIN_TITLE } from "../SiteCreationWizard";
import LandParcelsSelectionContainer from "./land-parcels-selection";
import LandParcelsSurfaceDistributionContainer from "./land-parcels-surface-distribution";

function SiteCreationUrbanZoneStepContent() {
  const currentStep = useAppSelector(selectCurrentStep);

  switch (currentStep) {
    case "URBAN_ZONE_LAND_PARCELS_SELECTION":
      return (
        <>
          <HtmlTitle>{`Surfaces foncières - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <LandParcelsSelectionContainer />
        </>
      );
    case "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION":
      return (
        <>
          <HtmlTitle>{`Surfaces des parcelles - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <LandParcelsSurfaceDistributionContainer />
        </>
      );
    default:
      return <HtmlTitle>{`Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>;
  }
}

export default SiteCreationUrbanZoneStepContent;
