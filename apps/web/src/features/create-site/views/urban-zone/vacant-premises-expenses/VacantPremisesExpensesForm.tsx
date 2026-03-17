import { useForm } from "react-hook-form";
import { sumList } from "shared";

import type { VacantPremisesExpenses } from "@/features/create-site/core/urban-zone/steps/expenses/vacant-premises-expenses/vacantPremisesExpenses.schema";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import FormRowNumericInput from "@/shared/views/components/form/NumericInput/FormRowNumericInput";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

function filterUndefined(value: number | undefined): value is number {
  return typeof value === "number";
}

type Props = {
  initialValues: Partial<VacantPremisesExpenses>;
  onSubmit: (data: VacantPremisesExpenses) => void;
  onBack: () => void;
};

export default function VacantPremisesExpensesForm({ initialValues, onSubmit, onBack }: Props) {
  const { handleSubmit, control, watch } = useForm<VacantPremisesExpenses>({
    defaultValues: initialValues,
  });

  const values = watch();
  const hasAnyValue = Object.values(values).some((v) => typeof v === "number");

  const ownerSubtotal = sumList(
    [
      values.ownerPropertyTaxes,
      values.ownerMaintenance,
      values.ownerSecurity,
      values.ownerIllegalDumpingCost,
      values.ownerOtherManagementCosts,
    ].filter(filterUndefined),
  );

  const tenantSubtotal = sumList(
    [values.tenantRent, values.tenantOperationsTaxes, values.tenantOtherOperationsCosts].filter(
      filterUndefined,
    ),
  );

  return (
    <WizardFormLayout title="Dépenses annuelles liées à la gestion et la sécurisation des locaux commerciaux vacants ou en friche">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="mb-0!">À la charge du gestionnaire de parc d'activité</h3>

        <FormRowNumericInput
          controller={{ name: "ownerPropertyTaxes", control }}
          label="Taxe foncière"
          addonText="€ / an"
        />
        <FormRowNumericInput
          controller={{ name: "ownerMaintenance", control }}
          label="Entretien et maintenance"
          addonText="€ / an"
        />
        <FormRowNumericInput
          controller={{ name: "ownerSecurity", control }}
          label="Gardiennage"
          addonText="€ / an"
        />
        <FormRowNumericInput
          controller={{ name: "ownerIllegalDumpingCost", control }}
          label="Débarras de dépôt sauvage"
          addonText="€ / an"
        />
        <FormRowNumericInput
          controller={{ name: "ownerOtherManagementCosts", control }}
          label="Autres charges"
          addonText="€ / an"
        />
        <RowNumericInput
          label="Sous-total"
          addonText="€ / an"
          disabled
          nativeInputProps={{ value: ownerSubtotal, readOnly: true }}
        />

        <h3 className="mb-0! mt-6">À la charge du locataire</h3>

        <FormRowNumericInput
          controller={{ name: "tenantRent", control }}
          label="Loyer"
          addonText="€ / an"
        />
        <FormRowNumericInput
          controller={{ name: "tenantOperationsTaxes", control }}
          label="Impôts et taxes"
          addonText="€ / an"
        />
        <FormRowNumericInput
          controller={{ name: "tenantOtherOperationsCosts", control }}
          label="Autres charges"
          addonText="€ / an"
        />
        <RowNumericInput
          label="Sous-total"
          addonText="€ / an"
          disabled
          nativeInputProps={{ value: tenantSubtotal, readOnly: true }}
        />

        <BackNextButtonsGroup onBack={onBack} nextLabel={hasAnyValue ? "Valider" : "Passer"} />
      </form>
    </WizardFormLayout>
  );
}
