import { selectCurrentStep } from "../../application/createSite.reducer";
import AddressForm from "./address";
import SiteCreationConfirmation from "./confirmation";
import SiteTypeForm from "./site-type";
import SiteSurfaceAreaForm from "./surface-area";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";

function SiteCreationExpressStepContent() {
  const currentStep = useAppSelector(selectCurrentStep);

  switch (currentStep) {
    case "SITE_NATURE":
      return <SiteTypeForm />;
    case "ADDRESS":
      return <AddressForm />;
    case "SURFACE_AREA":
      return <SiteSurfaceAreaForm />;
    case "CREATION_CONFIRMATION":
      return <SiteCreationConfirmation />;
  }
}

export default SiteCreationExpressStepContent;
