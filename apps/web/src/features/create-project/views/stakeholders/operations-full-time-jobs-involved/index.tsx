import OperationsFullTimeJobsInvolvedForm, {
  FormValues,
} from "./OperationsFullTimeJobsInvolvedForm";

import {
  goToStep,
  ProjectCreationStep,
  setOperationsFullTimeJobsInvolved,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: FormValues) => {
      dispatch(setOperationsFullTimeJobsInvolved(data.fullTimeJobs));
      dispatch(goToStep(ProjectCreationStep.COSTS_AND_REVENUE_INTRODUCTION));
    },
  };
};

function OperationsFullTimeJobsInvolvedFormContainer() {
  const dispatch = useAppDispatch();

  return <OperationsFullTimeJobsInvolvedForm {...mapProps(dispatch)} />;
}

export default OperationsFullTimeJobsInvolvedFormContainer;
