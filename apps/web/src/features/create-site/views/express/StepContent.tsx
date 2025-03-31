import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import { selectCurrentStep } from "../../core/createSite.reducer";
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
      return <AddressForm />;
    case "SURFACE_AREA":
      return <SiteSurfaceAreaForm />;
    case "FRICHE_ACTIVITY":
      return <FricheActivityForm />;
    case "AGRICULTURAL_OPERATION_ACTIVITY":
      return <AgriculturalOperationActivityForm />;
    case "NATURAL_AREA_TYPE":
      return <NaturalAreaTypeForm />;
    case "CREATION_RESULT":
      return <SiteCreationResult />;
  }
}

export default SiteCreationExpressStepContent;
