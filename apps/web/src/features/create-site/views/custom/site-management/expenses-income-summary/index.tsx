import SiteExpensesSummary from "./SiteExpensesIncomeSummary";

import { AppDispatch, RootState } from "@/app/application/store";
import {
  completeYearlyExpensesSummary,
  revertStep,
} from "@/features/create-site/application/createSite.reducer";
import { hasTenant } from "@/features/create-site/domain/site.functions";
import { SiteDraft } from "@/features/create-site/domain/siteFoncier.types";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch, siteData: RootState["siteCreation"]["siteData"]) => {
  const onNext = () => {
    dispatch(completeYearlyExpensesSummary());
  };

  const rent = (siteData.yearlyExpenses ?? [])
    .filter(({ purpose }) => purpose === "rent")
    .map(({ purpose, amount }) => ({ source: purpose, amount }));
  const operationsIncome = siteData.yearlyIncomes ?? [];
  const siteHasTenant = hasTenant(siteData as SiteDraft);

  return {
    isFriche: !!siteData.isFriche,
    ownerName: siteData.owner?.name,
    tenantName: siteData.tenant?.name,
    ownerExpenses: (siteData.yearlyExpenses ?? []).filter(({ bearer }) => bearer === "owner"),
    tenantExpenses: (siteData.yearlyExpenses ?? []).filter(({ bearer }) => bearer === "tenant"),
    ownerIncome: siteHasTenant ? rent : operationsIncome,
    tenantIncome: siteHasTenant ? operationsIncome : [],
    onNext,
    onBack: () => {
      dispatch(revertStep());
    },
  };
};

function SiteExpensesIncomeSummaryContainer() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector((state) => state.siteCreation.siteData);

  return <SiteExpensesSummary {...mapProps(dispatch, siteData)} />;
}

export default SiteExpensesIncomeSummaryContainer;
