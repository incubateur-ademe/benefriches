import SiteExpensesSummary from "./SiteExpensesSummary";

import { AppDispatch, RootState } from "@/app/application/store";
import { goToStep, SiteCreationStep } from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch, siteData: RootState["siteCreation"]["siteData"]) => {
  const onNext = () => {
    const nextStep = siteData.isFriche
      ? SiteCreationStep.SOILS_INTRODUCTION
      : SiteCreationStep.YEARLY_INCOME;
    dispatch(goToStep(nextStep));
  };

  return {
    isFriche: !!siteData.isFriche,
    ownerExpenses: (siteData.yearlyExpenses ?? []).filter(({ bearer }) => bearer === "owner"),
    tenantExpenses: (siteData.yearlyExpenses ?? []).filter(({ bearer }) => bearer === "tenant"),
    onNext,
  };
};

function SiteExpensesSummaryContainer() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector((state) => state.siteCreation.siteData);

  return <SiteExpensesSummary {...mapProps(dispatch, siteData)} />;
}

export default SiteExpensesSummaryContainer;
