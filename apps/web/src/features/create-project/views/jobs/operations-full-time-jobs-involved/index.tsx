import OperationsFullTimeJobsInvolvedForm, {
  FormValues,
} from "./OperationsFullTimeJobsInvolvedForm";

import { AppDispatch } from "@/app/application/store";
import {
  completeOperationsFullTimeJobsInvolved,
  revertOperationsFullTimeJobsInvolved,
} from "@/features/create-project/application/createProject.reducer";
import { computeDefaultPhotovoltaicOperationsFullTimeJobs } from "@/features/create-project/domain/defaultValues";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch, electricalPowerKWc?: number) => {
  return {
    defaultValue: electricalPowerKWc
      ? computeDefaultPhotovoltaicOperationsFullTimeJobs(electricalPowerKWc)
      : undefined,
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
  const electricalPowerKWc = useAppSelector(
    (state) => state.projectCreation.projectData.photovoltaicInstallationElectricalPowerKWc,
  );

  return <OperationsFullTimeJobsInvolvedForm {...mapProps(dispatch, electricalPowerKWc)} />;
}

export default OperationsFullTimeJobsInvolvedFormContainer;
