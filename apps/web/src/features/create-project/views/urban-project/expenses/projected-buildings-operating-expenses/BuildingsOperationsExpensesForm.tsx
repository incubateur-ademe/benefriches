import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { typedObjectEntries } from "shared";
import { sumObjectValues } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import FormRowNumericInput from "@/shared/views/components/form/NumericInput/FormRowNumericInput";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  title?: ReactNode;
  instructions?: ReactNode;
};

type FormValues = {
  maintenance?: number;
  taxes?: number;
  other?: number;
};

const BuildingsOperationsExpensesForm = ({ onSubmit, onBack, initialValues }: Props) => {
  const { handleSubmit, control, watch } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const allExpenses = watch();

  const hasNoValuesFilled =
    typedObjectEntries(allExpenses).filter(([, value]) => typeof value === "number").length === 0;

  return (
    <WizardFormLayout title="Dépenses annuelles d'exploitation des bâtiments">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormRowNumericInput
          controller={{ name: "maintenance", control }}
          className="pt-4!"
          addonText="€ / an"
          label="Entretien et maintenance"
        />
        <FormRowNumericInput
          controller={{ name: "taxes", control }}
          className="pt-4!"
          addonText="€ / an"
          label="Taxes et impôts"
        />
        <FormRowNumericInput
          controller={{ name: "other", control }}
          className="pt-4!"
          addonText="€ / an"
          label="Autres charges d'exploitation"
        />

        <RowNumericInput
          label={<span className="font-medium text-dsfr-text-label-grey">Total</span>}
          addonText="€"
          nativeInputProps={{
            value: new Intl.NumberFormat("fr-FR").format(sumObjectValues(allExpenses)),
          }}
          disabled
        />

        <BackNextButtonsGroup
          onBack={onBack}
          nextLabel={hasNoValuesFilled ? "Passer" : "Valider"}
        />
      </form>
    </WizardFormLayout>
  );
};

export default BuildingsOperationsExpensesForm;
