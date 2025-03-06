import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import { selectCurrentStep } from "../../core/createSite.reducer";
import AgriculturalOperationActivityForm from "../common-views/agricultural-operation-activity";
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
    case "AGRICULTURAL_OPERATION_ACTIVITY":
      return <AgriculturalOperationActivityForm />;
    case "CREATION_RESULT":
      return <SiteCreationResult />;
  }
}

export default SiteCreationExpressStepContent;
