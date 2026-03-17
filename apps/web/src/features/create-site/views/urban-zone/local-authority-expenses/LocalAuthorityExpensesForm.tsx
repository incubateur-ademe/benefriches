import { useForm } from "react-hook-form";
import { sumList } from "shared";

import type { LocalAuthorityExpenses } from "@/features/create-site/core/urban-zone/steps/expenses/local-authority-expenses/localAuthorityExpenses.schema";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import FormRowNumericInput from "@/shared/views/components/form/NumericInput/FormRowNumericInput";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues: Partial<LocalAuthorityExpenses>;
  onSubmit: (data: LocalAuthorityExpenses) => void;
  onBack: () => void;
};

export default function LocalAuthorityExpensesForm({ initialValues, onSubmit, onBack }: Props) {
  const { handleSubmit, control, watch } = useForm<LocalAuthorityExpenses>({
    defaultValues: initialValues,
  });

  const values = watch();
  const hasAnyValue = Object.values(values).some((v) => typeof v === "number");

  const total = sumList(
    [values.maintenance, values.otherManagementCosts].filter((v): v is number => v !== undefined),
  );

  return (
    <WizardFormLayout title="Dépenses annuelles liées à la gestion de la zone commerciale">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="mb-0!">À la charge de la collectivité</h3>

        <FormRowNumericInput
          controller={{ name: "maintenance", control }}
          label="Entretien et maintenance"
          addonText="€ / an"
        />
        <FormRowNumericInput
          controller={{ name: "otherManagementCosts", control }}
          label="Autres charges"
          addonText="€ / an"
        />
        <RowNumericInput
          label="Total"
          addonText="€ / an"
          disabled
          nativeInputProps={{ value: total, readOnly: true }}
        />

        <BackNextButtonsGroup onBack={onBack} nextLabel={hasAnyValue ? "Valider" : "Passer"} />
      </form>
    </WizardFormLayout>
  );
}
