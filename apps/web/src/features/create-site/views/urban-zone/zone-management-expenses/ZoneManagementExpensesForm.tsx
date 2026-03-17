import { useForm } from "react-hook-form";
import { sumList } from "shared";

import type { ZoneManagementExpenses } from "@/features/create-site/core/urban-zone/steps/expenses/zone-management-expenses/zoneManagementExpenses.schema";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import FormRowNumericInput from "@/shared/views/components/form/NumericInput/FormRowNumericInput";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

function isDefined(value: number | undefined): value is number {
  return typeof value === "number";
}

type Props = {
  initialValues: Partial<ZoneManagementExpenses>;
  onSubmit: (data: ZoneManagementExpenses) => void;
  onBack: () => void;
};

export default function ZoneManagementExpensesForm({ initialValues, onSubmit, onBack }: Props) {
  const { handleSubmit, control, watch } = useForm<ZoneManagementExpenses>({
    defaultValues: initialValues,
  });

  const values = watch();
  const hasAnyValue = Object.values(values).some((v) => typeof v === "number");

  const subtotal = sumList(
    [
      values.maintenance,
      values.security,
      values.illegalDumpingCost,
      values.otherManagementCosts,
    ].filter(isDefined),
  );

  return (
    <WizardFormLayout title="Dépenses annuelles liées à la gestion de la zone commerciale">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="mb-0!">À la charge du gestionnaire de parc d'activité</h3>

        <FormRowNumericInput
          controller={{ name: "maintenance", control }}
          label="Entretien et maintenance"
          addonText="€ / an"
        />
        <FormRowNumericInput
          controller={{ name: "security", control }}
          label="Gardiennage"
          addonText="€ / an"
        />
        <FormRowNumericInput
          controller={{ name: "illegalDumpingCost", control }}
          label="Débarras de dépôt sauvage"
          addonText="€ / an"
        />
        <FormRowNumericInput
          controller={{ name: "otherManagementCosts", control }}
          label="Autres charges"
          addonText="€ / an"
        />
        <RowNumericInput
          label="Sous-total"
          addonText="€ / an"
          disabled
          nativeInputProps={{ value: subtotal, readOnly: true }}
        />

        <BackNextButtonsGroup onBack={onBack} nextLabel={hasAnyValue ? "Valider" : "Passer"} />
      </form>
    </WizardFormLayout>
  );
}
