import SiteFullTimeJobsInvolvedForm, { FormValues } from "./SiteFullTimeJobsInvolvedForm";

import { AppDispatch } from "@/app/application/store";
import { revertFullTimeJobsInvolvedStep } from "@/features/create-site/application/createSite.actions";
import { completeFullTimeJobsInvolved } from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: FormValues) => {
      dispatch(completeFullTimeJobsInvolved({ jobs: data.fullTimeJobsInvolved }));
    },
    onBack: () => {
      dispatch(revertFullTimeJobsInvolvedStep());
    },
  };
};

function SiteFullTimeJobsInvolvedFormContainer() {
  const dispatch = useAppDispatch();

  return <SiteFullTimeJobsInvolvedForm {...mapProps(dispatch)} />;
}

export default SiteFullTimeJobsInvolvedFormContainer;
