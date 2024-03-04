import OperationsFullTimeJobsInvolvedForm, {
  FormValues,
} from "./OperationsFullTimeJobsInvolvedForm";

import { AppDispatch } from "@/app/application/store";
import {
  goToStep,
  ProjectCreationStep,
  setOperationsFullTimeJobsInvolved,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: FormValues) => {
      if (data.fullTimeJobs !== undefined)
        dispatch(setOperationsFullTimeJobsInvolved(data.fullTimeJobs));
      dispatch(goToStep(ProjectCreationStep.STAKEHOLDERS_HAS_REAL_ESTATE_TRANSACTION));
    },
  };
};

function OperationsFullTimeJobsInvolvedFormContainer() {
  const dispatch = useAppDispatch();

  return <OperationsFullTimeJobsInvolvedForm {...mapProps(dispatch)} />;
}

export default OperationsFullTimeJobsInvolvedFormContainer;
