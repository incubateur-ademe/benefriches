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
  const { handleSubmit, control, watch } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const allExpenses = watch();

  const hasNoValuesFilled =
    typedObjectEntries(allExpenses).filter(([, value]) => typeof value === "number").length === 0;

  return (
    <WizardFormLayout title={title} instructions={instructions}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormRowNumericInput
          controller={{ name: "rentAmount", control }}
          className="pt-4!"
          addonText="€ / an"
          label="Loyer"
        />
        <FormRowNumericInput
          controller={{ name: "maintenanceAmount", control }}
          className="pt-4!"
          addonText="€ / an"
          label="Maintenance"
        />
        <FormRowNumericInput
          controller={{ name: "taxesAmount", control }}
          className="pt-4!"
          addonText="€ / an"
          label="Taxes et impôts"
        />

        <FormRowNumericInput
          controller={{ name: "otherAmount", control }}
          className="pt-4!"
          addonText="€ / an"
          label="Autres dépenses"
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

export default YearlyProjectedExpensesForm;
