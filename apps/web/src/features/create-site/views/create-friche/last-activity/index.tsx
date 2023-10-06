import FricheLastActivityForm from "./FricheLastActivityForm";
import { buildViewModel } from "./fricheLastActivityFormViewModel";

import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function FricheLastActivityFormController() {
  const dispatch = useAppDispatch();
  const viewModel = buildViewModel(dispatch);

  return <FricheLastActivityForm {...viewModel} />;
}

export default FricheLastActivityFormController;
