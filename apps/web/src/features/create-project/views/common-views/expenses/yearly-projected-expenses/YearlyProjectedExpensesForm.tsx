import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { typedObjectEntries } from "shared";
import { sumObjectValues } from "shared";

import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
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

export type FormValues = {
  rentAmount?: number;
  maintenanceAmount?: number;
  taxesAmount?: number;
  otherAmount?: number;
};

const YearlyProjectedExpensesForm = ({
  onSubmit,
  onBack,
  initialValues,
  title = "Dépenses annuelles",
  instructions,
}: Props) => {
  const { handleSubmit, register, watch } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const allExpenses = watch();

  const hasNoValuesFilled =
    typedObjectEntries(allExpenses).filter(([, value]) => typeof value === "number").length === 0;

  return (
    <WizardFormLayout title={title} instructions={instructions}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RowDecimalsNumericInput
          className="!pt-4"
          addonText="€ / an"
          label="Loyer"
          nativeInputProps={register("rentAmount", optionalNumericFieldRegisterOptions)}
        />
        <RowDecimalsNumericInput
          className="!pt-4"
          addonText="€ / an"
          label="Maintenance"
          nativeInputProps={register("maintenanceAmount", optionalNumericFieldRegisterOptions)}
        />
        <RowDecimalsNumericInput
          className="!pt-4"
          addonText="€ / an"
          label="Taxes et impôts"
          nativeInputProps={register("taxesAmount", optionalNumericFieldRegisterOptions)}
        />

        <RowDecimalsNumericInput
          className="!pt-4"
          addonText="€ / an"
          label="Autres dépenses"
          nativeInputProps={register("otherAmount", optionalNumericFieldRegisterOptions)}
        />

        {!hasNoValuesFilled && (
          <p>
            <strong>
              Total des dépenses annuelles : {formatNumberFr(sumObjectValues(allExpenses))} €
            </strong>
          </p>
        )}

        <BackNextButtonsGroup
          onBack={onBack}
          nextLabel={hasNoValuesFilled ? "Passer" : "Valider"}
        />
      </form>
    </WizardFormLayout>
  );
};

export default YearlyProjectedExpensesForm;
