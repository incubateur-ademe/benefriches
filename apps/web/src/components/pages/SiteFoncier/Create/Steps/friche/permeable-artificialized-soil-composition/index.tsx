import PermeableArtificializedSoilForm from "./PermeableArtificializedSoilCompositionForm";
import { buildViewModel } from "./permeableArtificializedSoilCompositionViewModel";

import { useAppDispatch } from "@/store/hooks";

function PermeableArtificializedSoilFormController() {
  const dispatch = useAppDispatch();
  const viewModel = buildViewModel(dispatch);

  return <PermeableArtificializedSoilForm {...viewModel} />;
}

export default PermeableArtificializedSoilFormController;
