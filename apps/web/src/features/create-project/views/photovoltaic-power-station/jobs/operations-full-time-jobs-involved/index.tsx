import { AppDispatch } from "@/app/application/store";
import {
  completeOperationsFullTimeJobsInvolved,
  revertOperationsFullTimeJobsInvolved,
} from "@/features/create-project/application/createProject.reducer";
import { getDefaultValuesForFullTimeOperationsJobsInvolved } from "@/features/create-project/application/createProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import OperationsFullTimeJobsInvolvedForm, {
  FormValues,
} from "./OperationsFullTimeJobsInvolvedForm";

const mapProps = (dispatch: AppDispatch, defaultValue?: number) => {
  return {
    defaultValue,
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
  const defaultValue = useAppSelector(getDefaultValuesForFullTimeOperationsJobsInvolved);

  return <OperationsFullTimeJobsInvolvedForm {...mapProps(dispatch, defaultValue)} />;
}

export default OperationsFullTimeJobsInvolvedFormContainer;
