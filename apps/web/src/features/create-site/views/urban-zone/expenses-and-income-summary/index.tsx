import { useAppSelector } from "@/app/hooks/store.hooks";
import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

import UrbanZoneExpensesAndIncomeSummary from "./UrbanZoneExpensesAndIncomeSummary";

function ExpensesAndIncomeSummaryContainer() {
  const { onBack, onNext, selectExpensesAndIncomeSummaryViewData } = useUrbanZoneSiteForm();
  const { ownerExpenses, ownerIncome } = useAppSelector(selectExpensesAndIncomeSummaryViewData);

  return (
    <UrbanZoneExpensesAndIncomeSummary
      ownerExpenses={ownerExpenses}
      ownerIncome={ownerIncome}
      onNext={onNext}
      onBack={onBack}
    />
  );
}

export default ExpensesAndIncomeSummaryContainer;
