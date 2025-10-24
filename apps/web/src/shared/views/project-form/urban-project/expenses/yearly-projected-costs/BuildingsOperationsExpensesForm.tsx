import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { typedObjectEntries } from "shared";
import { sumObjectValues } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowDecimalsNumericInput from "@/shared/views/components/form/NumericInput/RowDecimalsNumericInput";
import { optionalNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
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
  const { handleSubmit, register, watch } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const allExpenses = watch();

  const hasNoValuesFilled =
    typedObjectEntries(allExpenses).filter(([, value]) => typeof value === "number").length === 0;

  return (
    <WizardFormLayout title="Dépenses annuelles d'exploitation des bâtiments">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RowDecimalsNumericInput
          className="pt-4!"
          addonText="€ / an"
          label="Entretien et maintenance"
          nativeInputProps={register("maintenance", optionalNumericFieldRegisterOptions)}
        />
        <RowDecimalsNumericInput
          className="pt-4!"
          addonText="€ / an"
          label="Taxes et impôts"
          nativeInputProps={register("taxes", optionalNumericFieldRegisterOptions)}
        />
        <RowDecimalsNumericInput
          className="pt-4!"
          addonText="€ / an"
          label="Autres charges d'exploitation"
          nativeInputProps={register("other", optionalNumericFieldRegisterOptions)}
        />

        <RowDecimalsNumericInput
          label={<span className="font-medium text-dsfr-text-label-grey">Total</span>}
          addonText="€"
          nativeInputProps={{
            value: sumObjectValues(allExpenses),
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
