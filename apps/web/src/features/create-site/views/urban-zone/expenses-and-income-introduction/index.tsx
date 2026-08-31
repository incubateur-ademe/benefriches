import { useUrbanZoneSiteForm } from "@/features/create-site/views/site-form/useUrbanZoneSiteForm";

import UrbanZoneExpensesAndIncomeIntroduction from "./UrbanZoneExpensesAndIncomeIntroduction";

function ExpensesAndIncomeIntroductionContainer() {
  const { onBack, onNext } = useUrbanZoneSiteForm();

  return <UrbanZoneExpensesAndIncomeIntroduction onNext={onNext} onBack={onBack} />;
}

export default ExpensesAndIncomeIntroductionContainer;
