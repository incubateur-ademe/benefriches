import NaturalAreaOperatingCompanyForm from "./NaturalAreaOperatingCompanyForm";
import { buildViewModel } from "./naturalAreaOperatingCompanyFormViewModel";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

function NaturalAreaOperatingCompanyFormController() {
  const dispatch = useAppDispatch();
  const owners = useAppSelector(
    (state) => state.naturalAreaCreation.naturalAreaData.owners,
  );
  const viewModel = buildViewModel(dispatch, owners ?? []);

  return <NaturalAreaOperatingCompanyForm {...viewModel} />;
}

export default NaturalAreaOperatingCompanyFormController;
