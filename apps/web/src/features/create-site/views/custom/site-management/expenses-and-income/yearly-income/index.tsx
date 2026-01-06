import { SiteYearlyIncome } from "shared";

import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { yearlyIncomeStepCompleted } from "@/features/create-site/core/actions/siteManagement.actions";
import { selectEstimatedYearlyIncomesForSite } from "@/features/create-site/core/selectors/incomes.selectors";
import { AppDispatch } from "@/shared/core/store-config/store";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteYearlyIncomeForm, { FormValues } from "./SiteYearlyIncomeForm";
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
  const incomesInStore = useAppSelector((state) => state.siteCreation.siteData.yearlyIncomes);
  const estimatedIncomeAmounts = useAppSelector(selectEstimatedYearlyIncomesForSite);

  return <SiteYearlyIncomeForm {...mapProps(dispatch, incomesInStore, estimatedIncomeAmounts)} />;
}

export default SiteYearlyIncomeFormContainer;
