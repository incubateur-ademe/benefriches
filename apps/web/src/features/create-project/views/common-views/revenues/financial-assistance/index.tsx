import { FinancialAssistanceRevenue, typedObjectEntries } from "shared";

import ProjectFinancialAssistanceRevenueForm, {
  FormValues,
} from "./ProjectFinancialAssistanceRevenueForm";

const mapFormValuesToFinancialAssistanceRevenues = (
  formData: FormValues,
): FinancialAssistanceRevenue[] => {
  const revenues: FinancialAssistanceRevenue[] = [];
  typedObjectEntries(formData).forEach(([source, amount]) => {
    if (!amount) return;
    switch (source) {
      case "localOrRegionalAuthorityAmount":
        revenues.push({ amount: amount, source: "local_or_regional_authority_participation" });
        break;
      case "publicSubsidiesAmount":
        revenues.push({ amount: amount, source: "public_subsidies" });
        break;
      case "otherAmount":
        revenues.push({ amount: amount, source: "other" });
        break;
      default:
        break;
    }
  });
  return revenues;
};

const mapFinnancialAssistanceRevenuesToFormValues = (
  financialAssistanceRevenues: FinancialAssistanceRevenue[],
): FormValues => {
  const formValues: FormValues = {};
  financialAssistanceRevenues.forEach((revenue) => {
    switch (revenue.source) {
      case "local_or_regional_authority_participation":
        formValues.localOrRegionalAuthorityAmount = revenue.amount;
        break;
      case "public_subsidies":
        formValues.publicSubsidiesAmount = revenue.amount;
        break;
      case "other":
        formValues.otherAmount = revenue.amount;
        break;
      default:
        break;
    }
  });
  return formValues;
};

type Props = {
  preEnteredData?: FinancialAssistanceRevenue[];
  onSubmit: (data: FinancialAssistanceRevenue[]) => void;
  onBack: () => void;
};

function ProjectFinancialAssistanceRevenueFormContainer({
  preEnteredData,
  onBack,
  onSubmit,
}: Props) {
  return (
    <ProjectFinancialAssistanceRevenueForm
      initialValues={preEnteredData && mapFinnancialAssistanceRevenuesToFormValues(preEnteredData)}
      onBack={onBack}
      onSubmit={(formData: FormValues) => {
        const financialAssistanceRevenues = mapFormValuesToFinancialAssistanceRevenues(formData);
        onSubmit(financialAssistanceRevenues);
      }}
    />
  );
}

export default ProjectFinancialAssistanceRevenueFormContainer;
