import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import { selectCurrentStep } from "../../application/createSite.reducer";
import AddressForm from "./address";
import SiteCreationResult from "./result";
import SiteTypeForm from "./site-type";
import SiteSurfaceAreaForm from "./surface-area";

function SiteCreationExpressStepContent() {
  const currentStep = useAppSelector(selectCurrentStep);

  switch (currentStep) {
    case "SITE_NATURE":
      return <SiteTypeForm />;
    case "ADDRESS":
      return <AddressForm />;
    case "SURFACE_AREA":
      return <SiteSurfaceAreaForm />;
    case "CREATION_RESULT":
      return <SiteCreationResult />;
  }
}

export default SiteCreationExpressStepContent;
