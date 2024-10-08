import { FinancialAssistanceRevenue, typedObjectEntries } from "shared";

import { AppDispatch } from "@/app/application/store";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import {
  completeFinancialAssistanceRevenues,
  revertFinancialAssistanceRevenues,
} from "../../../../application/createProject.reducer";
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

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (formData: FormValues) => {
      const financialAssistanceRevenues = mapFormValuesToFinancialAssistanceRevenues(formData);
      dispatch(completeFinancialAssistanceRevenues(financialAssistanceRevenues));
    },
    onBack: () => {
      dispatch(revertFinancialAssistanceRevenues());
    },
  };
};

function ProjectFinancialAssistanceRevenueFormContainer() {
  const dispatch = useAppDispatch();

  return <ProjectFinancialAssistanceRevenueForm {...mapProps(dispatch)} />;
}

export default ProjectFinancialAssistanceRevenueFormContainer;
