import SiteExpensesSummary from "./SiteExpensesSummary";

import { AppDispatch, RootState } from "@/app/application/store";
import {
  completeYearlyExpensesSummary,
  revertStep,
} from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch, siteData: RootState["siteCreation"]["siteData"]) => {
  const onNext = () => {
    dispatch(completeYearlyExpensesSummary());
  };

  return {
    isFriche: !!siteData.isFriche,
    ownerName: siteData.owner?.name,
    tenantName: siteData.tenant?.name,
    ownerExpenses: (siteData.yearlyExpenses ?? []).filter(({ bearer }) => bearer === "owner"),
    tenantExpenses: (siteData.yearlyExpenses ?? []).filter(({ bearer }) => bearer === "tenant"),
    onNext,
    onBack: () => {
      dispatch(revertStep());
    },
  };
};

function SiteExpensesSummaryContainer() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector((state) => state.siteCreation.siteData);

  return <SiteExpensesSummary {...mapProps(dispatch, siteData)} />;
}

export default SiteExpensesSummaryContainer;
