import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-site/core/custom/custom.actions";
import { selectSiteNature } from "@/features/create-site/core/selectors/createSite.selectors";

import SiteExpensesAndIncomeIntroduction from "./SiteExpensesAndIncomeIntroduction";

function SiteExpensesAndIncomeIntroductionContainer() {
  const dispatch = useAppDispatch();
  const siteNature = useAppSelector(selectSiteNature);

  return (
    <SiteExpensesAndIncomeIntroduction
      siteNature={siteNature}
      onNext={() => dispatch(nextStepRequested())}
      onBack={() => dispatch(previousStepRequested())}
    />
  );
}

export default SiteExpensesAndIncomeIntroductionContainer;
