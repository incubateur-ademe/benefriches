import { SiteYearlyIncome } from "shared";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { hasTenant } from "@/features/create-site/core/site.functions";
import type { SiteCreationData } from "@/features/create-site/core/siteFoncier.types";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import SiteExpensesSummary from "./SiteExpensesIncomeSummary";

const mapProps = (onNext: () => void, onBack: () => void, siteData: SiteCreationData) => {
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
    onNext,
    onBack,
  };
};

function SiteExpensesIncomeSummaryContainer() {
  const { onBack, onNext, selectDerivedSiteData } = useCustomSiteForm();
  const siteData = useAppSelector(selectDerivedSiteData);

  return <SiteExpensesSummary {...mapProps(onNext, onBack, siteData)} />;
}

export default SiteExpensesIncomeSummaryContainer;
