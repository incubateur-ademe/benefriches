import SiteExpensesSummary from "./SiteExpensesSummary";

import {
  goToStep,
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
    onNext: () => {
      const nextStep = siteData.isFriche
        ? SiteCreationStep.FRICHE_ACTIVITY
        : SiteCreationStep.NAMING;
      dispatch(goToStep(nextStep));
    },
  };
};

function SiteExpensesSummaryContainer() {
  const dispatch = useAppDispatch();
  const siteCreationState = useAppSelector((state) => state.siteCreation);

  return <SiteExpensesSummary {...mapProps(dispatch, siteCreationState)} />;
}

export default SiteExpensesSummaryContainer;
