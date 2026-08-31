import type { SiteYearlyIncome } from "shared";

import { useAppSelector } from "@/app/hooks/store.hooks";
import type { StepCompletionPayload } from "@/features/create-site/core/custom/custom.actions";
import { useCustomSiteForm } from "@/features/create-site/views/site-form/useCustomSiteForm";

import SiteYearlyIncomeForm, { type FormValues } from "./SiteYearlyIncomeForm";
import { getInitialValues, mapFormDataToIncomes } from "./mappers";

const mapProps = (
  onBack: () => void,
  onRequestStepCompletion: (payload: StepCompletionPayload) => void,
  incomesInStore: SiteYearlyIncome[],
  estimatedIncomeAmounts: SiteYearlyIncome[],
) => {
  return {
    initialValues: getInitialValues(incomesInStore, estimatedIncomeAmounts),
    onBack,
    onSubmit: (formData: FormValues) => {
      onRequestStepCompletion({
        stepId: "YEARLY_INCOME",
        answers: mapFormDataToIncomes(formData),
      });
    },
  };
};

function SiteYearlyIncomeFormContainer() {
  const { onBack, onRequestStepCompletion, selectYearlyIncomeFormViewData } = useCustomSiteForm();
  const { incomesInStore, estimatedIncomeAmounts } = useAppSelector(selectYearlyIncomeFormViewData);

  return (
    <SiteYearlyIncomeForm
      {...mapProps(onBack, onRequestStepCompletion, incomesInStore, estimatedIncomeAmounts)}
    />
  );
}

export default SiteYearlyIncomeFormContainer;
