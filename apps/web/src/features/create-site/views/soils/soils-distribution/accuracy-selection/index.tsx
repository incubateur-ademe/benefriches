import AccuracySelectionForm, { type FormValues } from "./AccuracySelectionForm";

import { revertSoilsSurfaceAreaDistributionEntryModeStep } from "@/features/create-site/application/createSite.actions";
import { completeSoilsSurfaceAreaDistributionEntryMode } from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function SiteSoilsDistributionAccuracySelectionContainer() {
  const dispatch = useAppDispatch();

  const onSubmit = ({ accuracy }: FormValues) => {
    dispatch(completeSoilsSurfaceAreaDistributionEntryMode(accuracy));
  };

  const onBack = () => {
    dispatch(revertSoilsSurfaceAreaDistributionEntryModeStep());
  };

  return <AccuracySelectionForm onSubmit={onSubmit} onBack={onBack} />;
}

export default SiteSoilsDistributionAccuracySelectionContainer;
