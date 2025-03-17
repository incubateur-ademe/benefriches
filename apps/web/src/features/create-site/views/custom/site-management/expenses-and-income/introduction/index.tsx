import {
  yearlyExpensesAndIncomeIntroductionCompleted,
  yearlyExpensesAndIncomeIntroductionReverted,
} from "@/features/create-site/core/actions/siteManagement.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteExpensesAndIncomeIntroduction from "./SiteExpensesAndIncomeIntroduction";

function SiteExpensesAndIncomeIntroductionContainer() {
  const dispatch = useAppDispatch();
  const siteNature = useAppSelector((state) => state.siteCreation.siteData.nature);

  return (
    <SiteExpensesAndIncomeIntroduction
      siteNature={siteNature}
      onNext={() => dispatch(yearlyExpensesAndIncomeIntroductionCompleted())}
      onBack={() => dispatch(yearlyExpensesAndIncomeIntroductionReverted())}
    />
  );
}

export default SiteExpensesAndIncomeIntroductionContainer;
