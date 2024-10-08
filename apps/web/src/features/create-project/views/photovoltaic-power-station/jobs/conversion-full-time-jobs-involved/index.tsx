import ConversionFullTimeJobsInvolvedForm, {
  FormValues,
} from "./ConversionFullTimeJobsInvolvedForm";

import { AppDispatch } from "@/app/application/store";
import {
  completeConversionFullTimeJobsInvolved,
  revertConversionFullTimeJobsInvolved,
} from "@/features/create-project/application/createProject.reducer";
import { getDefaultValuesForFullTimeConversionJobsInvolved } from "@/features/create-project/application/createProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (
  dispatch: AppDispatch,
  isFriche: boolean,
  defaultValues: { fullTimeJobs?: number; reinstatementFullTimeJobs?: number },
) => {
  return {
    defaultValues,
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
  const defaultValues = useAppSelector(getDefaultValuesForFullTimeConversionJobsInvolved);

  return <ConversionFullTimeJobsInvolvedForm {...mapProps(dispatch, isFriche, defaultValues)} />;
}

export default ConversionFullTimeJobsInvolvedFormContainer;
