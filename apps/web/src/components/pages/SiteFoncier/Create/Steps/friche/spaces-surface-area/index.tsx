import FricheSpacesSurfaceAreaForm from "./FricheSpacesSurfaceAreaForm";
import { buildViewModel } from "./fricheSpacesSurfaceAreaFormViewModel";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

function FricheSpacesSurfaceAreaFormController() {
  const dispatch = useAppDispatch();
  const fricheData = useAppSelector((state) => state.fricheCreation.fricheData);
  const viewModel = buildViewModel(dispatch, fricheData);

  return <FricheSpacesSurfaceAreaForm {...viewModel} />;
}

export default FricheSpacesSurfaceAreaFormController;
