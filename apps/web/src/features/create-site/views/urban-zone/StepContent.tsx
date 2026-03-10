import { useAppSelector } from "@/app/hooks/store.hooks";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";

import { selectCurrentStep } from "../../core/createSite.reducer";
import { getParcelTypeFromStepId } from "../../core/urban-zone/steps/per-parcel-soils/parcelStepMapping";
import { HTML_MAIN_TITLE } from "../SiteCreationWizard";
import LandParcelBuildingsFloorAreaContainer from "./land-parcel-buildings-floor-area";
import LandParcelSoilsDistributionContainer from "./land-parcel-soils-distribution";
import LandParcelsSelectionContainer from "./land-parcels-selection";
import LandParcelsSurfaceDistributionContainer from "./land-parcels-surface-distribution";
import SoilsAndSpacesIntroductionContainer from "./soils-and-spaces-introduction";
import UrbanZoneSoilsSummaryContainer from "./soils-summary";

function SiteCreationUrbanZoneStepContent() {
  const currentStep = useAppSelector(selectCurrentStep);

  switch (currentStep) {
    case "URBAN_ZONE_SOILS_AND_SPACES_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Sols et espaces - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SoilsAndSpacesIntroductionContainer />
        </>
      );
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
    case "URBAN_ZONE_SOILS_SUMMARY":
      return (
        <>
          <HtmlTitle>{`Récapitulatif des sols - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <UrbanZoneSoilsSummaryContainer />
        </>
      );
    default: {
      const parcelType = getParcelTypeFromStepId(currentStep);
      if (parcelType) {
        if (currentStep.endsWith("_SOILS_DISTRIBUTION")) {
          return (
            <>
              <HtmlTitle>{`Superficie des sols - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
              <LandParcelSoilsDistributionContainer parcelType={parcelType} />
            </>
          );
        }
        if (currentStep.endsWith("_BUILDINGS_FLOOR_AREA")) {
          return (
            <>
              <HtmlTitle>{`Surface de plancher - Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>
              <LandParcelBuildingsFloorAreaContainer parcelType={parcelType} />
            </>
          );
        }
      }
      return <HtmlTitle>{`Zone urbaine - ${HTML_MAIN_TITLE}`}</HtmlTitle>;
    }
  }
}

export default SiteCreationUrbanZoneStepContent;
