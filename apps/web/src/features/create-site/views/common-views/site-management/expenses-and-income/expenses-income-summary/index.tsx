import { SiteYearlyIncome } from "shared";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { AppDispatch } from "@/app/store/store";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-site/core/custom/custom.actions";
import { selectDerivedSiteData } from "@/features/create-site/core/selectors/createSite.selectors";
import { hasTenant } from "@/features/create-site/core/site.functions";
import type { SiteCreationData } from "@/features/create-site/core/siteFoncier.types";

import SiteExpensesSummary from "./SiteExpensesIncomeSummary";

const mapProps = (dispatch: AppDispatch, siteData: SiteCreationData) => {
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
      dispatch(nextStepRequested());
    },
    onBack: () => {
      dispatch(previousStepRequested());
    },
  };
};

function SiteExpensesIncomeSummaryContainer() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector(selectDerivedSiteData);

  return <SiteExpensesSummary {...mapProps(dispatch, siteData)} />;
}

export default SiteExpensesIncomeSummaryContainer;
