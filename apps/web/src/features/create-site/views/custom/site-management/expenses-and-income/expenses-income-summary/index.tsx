import { SiteYearlyIncome } from "shared";

import { stepRevertAttempted } from "@/features/create-site/core/actions/revert.actions";
import { yearlyExpensesSummaryCompleted } from "@/features/create-site/core/actions/siteManagement.actions";
import { hasTenant } from "@/features/create-site/core/site.functions";
import { AppDispatch, RootState } from "@/shared/core/store-config/store";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteExpensesSummary from "./SiteExpensesIncomeSummary";

const mapProps = (dispatch: AppDispatch, siteData: RootState["siteCreation"]["siteData"]) => {
  const rent = siteData.yearlyExpenses
    .filter(({ purpose }) => purpose === "rent")
    .map(({ purpose, amount }) => ({ source: purpose, amount })) as SiteYearlyIncome[];
  const operationsIncome = siteData.yearlyIncomes;
  const siteHasTenant = hasTenant(siteData);

  return {
    isFriche: !!siteData.isFriche,
    ownerName: siteData.owner?.name,
    tenantName: siteData.tenant?.name,
    ownerExpenses: siteData.yearlyExpenses.filter(({ bearer }) => bearer === "owner"),
    tenantExpenses: siteData.yearlyExpenses.filter(({ bearer }) => bearer === "tenant"),
    ownerIncome: siteHasTenant ? rent : operationsIncome,
    tenantIncome: siteHasTenant ? operationsIncome : [],
    onNext: () => {
      dispatch(yearlyExpensesSummaryCompleted());
    },
    onBack: () => {
      dispatch(stepRevertAttempted());
    },
  };
};

function SiteExpensesIncomeSummaryContainer() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector((state) => state.siteCreation.siteData);

  return <SiteExpensesSummary {...mapProps(dispatch, siteData)} />;
}

export default SiteExpensesIncomeSummaryContainer;
