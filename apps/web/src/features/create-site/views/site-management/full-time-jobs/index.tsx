import SiteFullTimeJobsInvolvedForm, {
  FormValues,
} from "./SiteFullTimeJobsInvolvedForm";

import {
  goToStep,
  setFullTimeJobsInvolved,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";
import { AppDispatch, RootState } from "@/store";

const mapProps = (
  dispatch: AppDispatch,
  { siteData }: RootState["siteCreation"],
) => {
  return {
    onSubmit: (data: FormValues) => {
      dispatch(setFullTimeJobsInvolved(data.fullTimeJobsInvolved));
      const nextStep = siteData.isFriche
        ? SiteCreationStep.RECENT_ACCIDENTS
        : SiteCreationStep.YEARLY_EXPENSES;
      dispatch(goToStep(nextStep));
    },
  };
};

function SiteFullTimeJobsInvolvedFormContainer() {
  const dispatch = useAppDispatch();
  const siteCreation = useAppSelector((state) => state.siteCreation);

  return <SiteFullTimeJobsInvolvedForm {...mapProps(dispatch, siteCreation)} />;
}

export default SiteFullTimeJobsInvolvedFormContainer;
