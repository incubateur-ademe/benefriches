import FricheSpacesForm from "./FricheSpacesForm";
import { buildViewModel } from "./fricheSpacesFormViewModel";

import { useAppDispatch } from "@/store/hooks";

function FricheSpacesFormController() {
  const dispatch = useAppDispatch();
  const viewModel = buildViewModel(dispatch);

  return <FricheSpacesForm {...viewModel} />;
}

export default FricheSpacesFormController;
