import SiteYearlyIncomeForm, { FormValues } from "./SiteYearlyIncomeForm";

import {
  goToStep,
  setYearlyIncome,
  SiteCreationStep,
} from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (data: FormValues) => {
      const income = Object.entries(data).reduce(
        (sum, [, amount]) => sum + (amount ?? 0),
        0,
      );
      dispatch(setYearlyIncome(income));
      dispatch(goToStep(SiteCreationStep.EXPENSES_SUMMARY));
    },
  };
};

function SiteYearlyIncomeFormContainer() {
  const dispatch = useAppDispatch();

  return <SiteYearlyIncomeForm {...mapProps(dispatch)} />;
}

export default SiteYearlyIncomeFormContainer;
