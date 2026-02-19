import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { yearlyExpensesAndIncomeIntroductionCompleted } from "@/features/create-site/core/steps/site-management/siteManagement.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteExpensesAndIncomeIntroduction from "./SiteExpensesAndIncomeIntroduction";

function SiteExpensesAndIncomeIntroductionContainer() {
  const dispatch = useAppDispatch();
  const siteNature = useAppSelector((state) => state.siteCreation.siteData.nature);

  return (
    <SiteExpensesAndIncomeIntroduction
      siteNature={siteNature}
      onNext={() => dispatch(yearlyExpensesAndIncomeIntroductionCompleted())}
      onBack={() => dispatch(stepReverted())}
    />
  );
}

export default SiteExpensesAndIncomeIntroductionContainer;
