import PermeableArtificializedSoilDistributionForm from "./PermeableArtificializedSoilDistributionForm";
import { buildViewModel } from "./permeableArtificialSoilDistributionViewModel";

import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";

function PermeableArtificializedSoilDistributionFormController() {
  const dispatch = useAppDispatch();
  const fricheData = useAppSelector((state) => state.fricheCreation.fricheData);
  const viewModel = buildViewModel(dispatch, fricheData);

  return <PermeableArtificializedSoilDistributionForm {...viewModel} />;
}

export default PermeableArtificializedSoilDistributionFormController;
