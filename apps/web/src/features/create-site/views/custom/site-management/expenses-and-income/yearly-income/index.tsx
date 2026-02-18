import type { SiteYearlyIncome } from "shared";

import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { yearlyIncomeStepCompleted } from "@/features/create-site/core/actions/siteManagement.actions";
import { selectYearlyIncomeFormViewData } from "@/features/create-site/core/selectors/incomes.selectors";
import type { AppDispatch } from "@/shared/core/store-config/store";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteYearlyIncomeForm, { type FormValues } from "./SiteYearlyIncomeForm";
import { getInitialValues, mapFormDataToIncomes } from "./mappers";

const mapProps = (
  dispatch: AppDispatch,
  incomesInStore: SiteYearlyIncome[],
  estimatedIncomeAmounts: SiteYearlyIncome[],
) => {
  return {
    initialValues: getInitialValues(incomesInStore, estimatedIncomeAmounts),
    onBack: () => {
      dispatch(stepReverted());
    },
    onSubmit: (formData: FormValues) => {
      dispatch(yearlyIncomeStepCompleted(mapFormDataToIncomes(formData)));
    },
  };
};

function SiteYearlyIncomeFormContainer() {
  const dispatch = useAppDispatch();
  const { incomesInStore, estimatedIncomeAmounts } = useAppSelector(selectYearlyIncomeFormViewData);

  return <SiteYearlyIncomeForm {...mapProps(dispatch, incomesInStore, estimatedIncomeAmounts)} />;
}

export default SiteYearlyIncomeFormContainer;
