import {
  revertStep,
  yearlyExpensesAndIncomeIntroductionCompleted,
} from "@/features/create-site/core/createSite.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteExpensesAndIncomeIntroduction from "./SiteExpensesAndIncomeIntroduction";

function SiteExpensesAndIncomeIntroductionContainer() {
  const dispatch = useAppDispatch();
  const siteNature = useAppSelector((state) => state.siteCreation.siteData.nature);

  return (
    <SiteExpensesAndIncomeIntroduction
      siteNature={siteNature}
      onNext={() => dispatch(yearlyExpensesAndIncomeIntroductionCompleted())}
      onBack={() => dispatch(revertStep())}
    />
  );
}

export default SiteExpensesAndIncomeIntroductionContainer;
