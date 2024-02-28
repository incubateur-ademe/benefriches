import AccuracySelectionForm, { type FormValues } from "./AccuracySelectionForm";

import { completeSoilsSurfaceAreaDistributionEntryMode } from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function SiteSoilsDistributionAccuracySelectionContainer() {
  const dispatch = useAppDispatch();

  const onSubmit = ({ accuracy }: FormValues) => {
    dispatch(completeSoilsSurfaceAreaDistributionEntryMode(accuracy));
  };

  return <AccuracySelectionForm onSubmit={onSubmit} />;
}

export default SiteSoilsDistributionAccuracySelectionContainer;
