import FricheFullTimeJobsInvolvedForm, {
  FormValues,
} from "./FricheFullTimeJobsInvolvedForm";

import { setFullTimeJobsInvolved } from "@/features/create-site/application/createFriche.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: FormValues) =>
      dispatch(setFullTimeJobsInvolved(data.fullTimeJobsInvolved)),
  };
};

function FricheFullTimeJobsInvolvedFormContainer() {
  const dispatch = useAppDispatch();

  return <FricheFullTimeJobsInvolvedForm {...mapProps(dispatch)} />;
}

export default FricheFullTimeJobsInvolvedFormContainer;
