import NaturalAreaOwnersForm from "./NaturalAreaOwnersForm";
import { buildViewModel } from "./naturalAreaOwnersFormViewModel";

import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function NaturalAreaOwnersFormController() {
  const dispatch = useAppDispatch();
  const viewModel = buildViewModel(dispatch);

  return <NaturalAreaOwnersForm {...viewModel} />;
}

export default NaturalAreaOwnersFormController;
