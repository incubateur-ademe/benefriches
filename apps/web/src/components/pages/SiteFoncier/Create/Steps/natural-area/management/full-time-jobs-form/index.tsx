import NaturalAreaFullTimeJobsInvolvedForm from "./NaturalAreaFullTimeJobsInvolvedForm";
import { buildViewModel } from "./naturalAreaFullTimeJobsInvolvedFormViewModel";

import { useAppDispatch } from "@/store/hooks";

function NaturalAreaFullTimeJobsInvolvedFormController() {
  const dispatch = useAppDispatch();
  const viewModel = buildViewModel(dispatch);

  return <NaturalAreaFullTimeJobsInvolvedForm {...viewModel} />;
}

export default NaturalAreaFullTimeJobsInvolvedFormController;
