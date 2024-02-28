import SiteFullTimeJobsInvolvedForm, { FormValues } from "./SiteFullTimeJobsInvolvedForm";

import { AppDispatch } from "@/app/application/store";
import { completeFullTimeJobsInvolved } from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: FormValues) => {
      dispatch(completeFullTimeJobsInvolved({ jobs: data.fullTimeJobsInvolved }));
    },
  };
};

function SiteFullTimeJobsInvolvedFormContainer() {
  const dispatch = useAppDispatch();

  return <SiteFullTimeJobsInvolvedForm {...mapProps(dispatch)} />;
}

export default SiteFullTimeJobsInvolvedFormContainer;
