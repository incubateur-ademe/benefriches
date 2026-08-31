import { useAppSelector } from "@/app/hooks/store.hooks";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import SiteExpensesAndIncomeIntroduction from "./SiteExpensesAndIncomeIntroduction";

function SiteExpensesAndIncomeIntroductionContainer() {
  const { onBack, onNext, selectSiteNature } = useCustomSiteForm();
  const siteNature = useAppSelector(selectSiteNature);

  return (
    <SiteExpensesAndIncomeIntroduction siteNature={siteNature} onNext={onNext} onBack={onBack} />
  );
}

export default SiteExpensesAndIncomeIntroductionContainer;
