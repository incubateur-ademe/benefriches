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

type Props = {
  initialValues?: {
    localOrRegionalAuthority: number;
    publicSubsidies: number;
    other: number;
  };
  onSubmit: (data: FinancialAssistanceRevenue[]) => void;
  onBack: () => void;
};

function ProjectFinancialAssistanceRevenueFormContainer({
  initialValues,
  onBack,
  onSubmit,
}: Props) {
  return (
    <ProjectFinancialAssistanceRevenueForm
      initialValues={
        initialValues && {
          localOrRegionalAuthorityAmount: initialValues.localOrRegionalAuthority,
          publicSubsidiesAmount: initialValues.publicSubsidies,
          otherAmount: initialValues.other,
        }
      }
      onBack={onBack}
      onSubmit={(formData: FormValues) => {
        const financialAssistanceRevenues = mapFormValuesToFinancialAssistanceRevenues(formData);
        onSubmit(financialAssistanceRevenues);
      }}
    />
  );
}

export default ProjectFinancialAssistanceRevenueFormContainer;
