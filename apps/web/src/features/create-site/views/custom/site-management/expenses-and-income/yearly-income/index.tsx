import { SiteYearlyIncome } from "shared";

import { stepRevertAttempted } from "@/features/create-site/core/actions/revert.actions";
import { yearlyIncomeStepCompleted } from "@/features/create-site/core/actions/siteManagement.actions";
import { AppDispatch } from "@/shared/core/store-config/store";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import SiteYearlyIncomeForm, { FormValues } from "./SiteYearlyIncomeForm";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onBack: () => {
      dispatch(stepRevertAttempted());
    },
    onSubmit: (formData: FormValues) => {
      const incomes: SiteYearlyIncome[] = [];
      if (formData.operationsIncome) {
        incomes.push({
          source: "operations",
          amount: formData.operationsIncome,
        });
      }
      if (formData.otherIncome) {
        incomes.push({
          source: "other",
          amount: formData.otherIncome,
        });
      }
      dispatch(yearlyIncomeStepCompleted(incomes));
    },
  };
};

function SiteYearlyIncomeFormContainer() {
  const dispatch = useAppDispatch();

  return <SiteYearlyIncomeForm {...mapProps(dispatch)} />;
}

export default SiteYearlyIncomeFormContainer;
