import SiteYearlyIncomeForm, { FormValues } from "./SiteYearlyIncomeForm";

import {
  addIncomes,
  goToStep,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (formData: FormValues) => {
      const incomes = [];
      if (formData.operationsIncome) {
        incomes.push({
          type: "operations",
          amount: formData.operationsIncome,
        });
      }
      if (formData.otherIncome) {
        incomes.push({
          type: "other",
          amount: formData.otherIncome,
        });
      }
      if (incomes.length > 0) dispatch(addIncomes(incomes));
      dispatch(goToStep(SiteCreationStep.EXPENSES_SUMMARY));
    },
  };
};

function SiteYearlyIncomeFormContainer() {
  const dispatch = useAppDispatch();

  return <SiteYearlyIncomeForm {...mapProps(dispatch)} />;
}

export default SiteYearlyIncomeFormContainer;
