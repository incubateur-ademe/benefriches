import { useAppSelector } from "@/app/hooks/store.hooks";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

import LandParcelsSelectionForm, { type FormValues } from "./LandParcelsSelectionForm";

function LandParcelsSelectionContainer() {
  const { onBack, onRequestStepCompletion, selectLandParcelsSelectionViewData } =
    useUrbanZoneSiteForm();
  const { initialSelectedTypes } = useAppSelector(selectLandParcelsSelectionViewData);

  return (
    <LandParcelsSelectionForm
      initialValues={{ landParcelTypes: initialSelectedTypes }}
      onSubmit={(data: FormValues) => {
        onRequestStepCompletion({
          stepId: "URBAN_ZONE_LAND_PARCELS_SELECTION",
          answers: { landParcelTypes: data.landParcelTypes },
        });
      }}
      onBack={() => {
        onBack();
      }}
    />
  );
}

export default LandParcelsSelectionContainer;
