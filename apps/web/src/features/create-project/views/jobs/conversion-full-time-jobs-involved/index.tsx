import ConversionFullTimeJobsInvolvedForm, {
  FormValues,
} from "./ConversionFullTimeJobsInvolvedForm";

import { AppDispatch } from "@/app/application/store";
import {
  completeConversionFullTimeJobsInvolved,
  revertConversionFullTimeJobsInvolved,
} from "@/features/create-project/application/createProject.reducer";
import {
  computeDefaultPhotovoltaicConversionFullTimeJobs,
  computeDefaultReinstatementFullTimeJobs,
} from "@/features/create-project/domain/defaultValues";
import { ReinstatementCosts } from "@/features/create-project/domain/project.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (
  dispatch: AppDispatch,
  isFriche: boolean,
  electricalPowerKWc?: number,
  reinstatementCosts?: ReinstatementCosts,
) => {
  return {
    defaultValues: {
      fullTimeJobs: electricalPowerKWc
        ? computeDefaultPhotovoltaicConversionFullTimeJobs(electricalPowerKWc)
        : undefined,
      reinstatementFullTimeJobs:
        isFriche && reinstatementCosts
          ? computeDefaultReinstatementFullTimeJobs(reinstatementCosts.expenses)
          : undefined,
    },
    askForReinstatementFullTimeJobs: isFriche,
    onSubmit: (data: FormValues) => {
      dispatch(completeConversionFullTimeJobsInvolved(data));
    },
    onBack: () => {
      dispatch(revertConversionFullTimeJobsInvolved());
    },
  };
};

function ConversionFullTimeJobsInvolvedFormContainer() {
  const dispatch = useAppDispatch();
  const isFriche = useAppSelector((state) => state.projectCreation.siteData?.isFriche ?? false);
  const { photovoltaicInstallationElectricalPowerKWc: electricalPowerKWc, reinstatementCosts } =
    useAppSelector((state) => state.projectCreation.projectData);

  return (
    <ConversionFullTimeJobsInvolvedForm
      {...mapProps(dispatch, isFriche, electricalPowerKWc, reinstatementCosts)}
    />
  );
}

export default ConversionFullTimeJobsInvolvedFormContainer;
