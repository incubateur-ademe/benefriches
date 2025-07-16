import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import { selectCurrentStep } from "../../core/createSite.reducer";
import { HTML_MAIN_TITLE } from "../SiteCreationWizard";
import AgriculturalOperationActivityForm from "../common-views/agricultural-operation-activity";
import NaturalAreaTypeForm from "../common-views/natural-area-type";
import FricheActivityForm from "../custom/friche-activity";
import AddressForm from "./address";
import SiteCreationResult from "./result";
import SiteSurfaceAreaForm from "./surface-area";

function SiteCreationExpressStepContent() {
  const currentStep = useAppSelector(selectCurrentStep);

  switch (currentStep) {
    case "ADDRESS":
      return (
        <>
          <HtmlTitle>{`Adresse - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <AddressForm />
        </>
      );
    case "SURFACE_AREA":
      return (
        <>
          <HtmlTitle>{`Surface du site - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteSurfaceAreaForm />
        </>
      );
    case "FRICHE_ACTIVITY":
      return (
        <>
          <HtmlTitle>{`Ancienne activité - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <FricheActivityForm />
        </>
      );
    case "AGRICULTURAL_OPERATION_ACTIVITY":
      return (
        <>
          <HtmlTitle>{`Activité de l'exploitation - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <AgriculturalOperationActivityForm />
        </>
      );
    case "NATURAL_AREA_TYPE":
      return (
        <>
          <HtmlTitle>{`Type de surface de nature - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <NaturalAreaTypeForm />
        </>
      );
    case "CREATION_RESULT":
      return (
        <>
          <HtmlTitle>{`Résultat - ${HTML_MAIN_TITLE}`}</HtmlTitle>
          <SiteCreationResult />
        </>
      );
  }
}

export default SiteCreationExpressStepContent;
