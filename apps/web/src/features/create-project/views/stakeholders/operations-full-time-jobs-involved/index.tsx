import OperationsFullTimeJobsInvolvedForm, {
  FormValues,
} from "./OperationsFullTimeJobsInvolvedForm";

import { AppDispatch } from "@/app/application/store";
import {
  completeOperationsFullTimeJobsInvolved,
  revertOperationsFullTimeJobsInvolved,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: FormValues) => {
      dispatch(completeOperationsFullTimeJobsInvolved(data.fullTimeJobs));
    },
    onBack: () => {
      dispatch(revertOperationsFullTimeJobsInvolved());
    },
  };
};

function OperationsFullTimeJobsInvolvedFormContainer() {
  const dispatch = useAppDispatch();

  return <OperationsFullTimeJobsInvolvedForm {...mapProps(dispatch)} />;
}

export default OperationsFullTimeJobsInvolvedFormContainer;
