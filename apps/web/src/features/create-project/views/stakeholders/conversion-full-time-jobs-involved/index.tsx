import ConversionFullTimeJobsInvolvedForm, {
  FormValues,
} from "./ConversionFullTimeJobsInvolvedForm";

import { AppDispatch } from "@/app/application/store";
import { completeConversionFullTimeJobsInvolved } from "@/features/create-project/application/createProject.reducer";
import { ProjectSite } from "@/features/create-project/domain/project.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch, projectSite?: ProjectSite) => {
  return {
    askForReinstatementFullTimeJobs: projectSite?.isFriche ?? false,
    onSubmit: (data: FormValues) => {
      dispatch(completeConversionFullTimeJobsInvolved(data));
    },
  };
};

function ConversionFullTimeJobsInvolvedFormContainer() {
  const dispatch = useAppDispatch();
  const projectSite = useAppSelector((state) => state.projectCreation.siteData);

  return <ConversionFullTimeJobsInvolvedForm {...mapProps(dispatch, projectSite)} />;
}

export default ConversionFullTimeJobsInvolvedFormContainer;
