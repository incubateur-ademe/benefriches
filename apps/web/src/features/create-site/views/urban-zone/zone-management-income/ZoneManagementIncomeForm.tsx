import { useForm } from "react-hook-form";
import { sumList } from "shared";

import type { ZoneManagementIncome } from "@/features/create-site/core/urban-zone/steps/expenses/zone-management-income/zoneManagementIncome.schema";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import FormRowNumericInput from "@/shared/views/components/form/NumericInput/FormRowNumericInput";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues: Partial<ZoneManagementIncome>;
  onSubmit: (data: ZoneManagementIncome) => void;
  onBack: () => void;
};

export default function ZoneManagementIncomeForm({ initialValues, onSubmit, onBack }: Props) {
  const { handleSubmit, control, watch } = useForm<ZoneManagementIncome>({
    defaultValues: initialValues,
  });

  const values = watch();
  const hasAnyValue = Object.values(values).some((v) => typeof v === "number");

  const total = sumList(
    [values.rent, values.subsidies, values.otherIncome].filter((v): v is number => v !== undefined),
  );

  return (
    <WizardFormLayout title="Recettes annuelles liées à la gestion de la zone commerciale">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="mb-0!">Au bénéfice du gestionnaire de parc d'activité</h3>

        <FormRowNumericInput
          controller={{ name: "rent", control }}
          label="Revenus locatifs"
          addonText="€ / an"
        />
        <FormRowNumericInput
          controller={{ name: "subsidies", control }}
          label="Subventions"
          addonText="€ / an"
        />
        <FormRowNumericInput
          controller={{ name: "otherIncome", control }}
          label="Autres recettes"
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
