import SiteYearlyIncomeForm, { FormValues } from "./SiteYearlyIncomeForm";

import { AppDispatch } from "@/app/application/store";
import {
  addIncomes,
  goToStep,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (formData: FormValues) => {
      const incomes = [];
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
      if (incomes.length > 0) dispatch(addIncomes(incomes));
      dispatch(goToStep(SiteCreationStep.SOILS_INTRODUCTION));
    },
  };
};

function SiteYearlyIncomeFormContainer() {
  const dispatch = useAppDispatch();

  return <SiteYearlyIncomeForm {...mapProps(dispatch)} />;
}

export default SiteYearlyIncomeFormContainer;
