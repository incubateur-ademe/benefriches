import type { SiteYearlyIncome } from "shared";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import type { AppDispatch } from "@/app/store/store";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/custom/custom.actions";
import { selectYearlyIncomeFormViewData } from "@/features/create-site/core/steps/site-management/siteManagement.selectors";

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
      dispatch(previousStepRequested());
    },
    onSubmit: (formData: FormValues) => {
      dispatch(
        stepCompletionRequested({
          stepId: "YEARLY_INCOME",
          answers: mapFormDataToIncomes(formData),
        }),
      );
    },
  };
};

function SiteYearlyIncomeFormContainer() {
  const dispatch = useAppDispatch();
  const { incomesInStore, estimatedIncomeAmounts } = useAppSelector(selectYearlyIncomeFormViewData);

  return <SiteYearlyIncomeForm {...mapProps(dispatch, incomesInStore, estimatedIncomeAmounts)} />;
}

export default SiteYearlyIncomeFormContainer;
