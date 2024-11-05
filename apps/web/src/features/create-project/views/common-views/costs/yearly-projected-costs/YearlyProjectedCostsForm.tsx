import { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { typedObjectEntries } from "shared";
import { sumObjectValues } from "shared";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  title?: ReactNode;
  instructions?: ReactNode;
  defaultValues?: {
    rent: number;
    maintenance: number;
    taxes: number;
  };
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
  defaultValues,
  title = "Dépenses annuelles",
  instructions,
}: Props) => {
  const { handleSubmit, control, watch } = useForm<FormValues>({
    defaultValues: {
      rentAmount: defaultValues?.rent,
      maintenanceAmount: defaultValues?.maintenance,
      taxesAmount: defaultValues?.taxes,
    },
  });

  const allExpenses = watch();

  const hasNoValuesFilled =
    typedObjectEntries(allExpenses).filter(([, value]) => typeof value === "number").length === 0;

  return (
    <WizardFormLayout title={title} instructions={instructions}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="rentAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez entrer un montant valide",
            },
          }}
          render={(controller) => {
            return (
              <ControlledRowNumericInput
                controlProps={controller}
                label="Loyer"
                addonText="€ / an"
                className="!tw-pt-4"
              />
            );
          }}
        />
        <Controller
          control={control}
          name="maintenanceAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez entrer un montant valide",
            },
          }}
          render={(controller) => {
            return (
              <ControlledRowNumericInput
                controlProps={controller}
                label="Maintenance"
                addonText="€ / an"
                className="!tw-pt-4"
              />
            );
          }}
        />
        <Controller
          control={control}
          name="taxesAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez entrer un montant valide",
            },
          }}
          render={(controller) => {
            return (
              <ControlledRowNumericInput
                controlProps={controller}
                label="Taxes et impôts"
                addonText="€ / an"
                className="!tw-pt-4"
              />
            );
          }}
        />

        <Controller
          control={control}
          name="otherAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez entrer un montant valide",
            },
          }}
          render={(controller) => {
            return (
              <ControlledRowNumericInput
                controlProps={controller}
                label="Autres dépenses"
                addonText="€ / an"
                className="!tw-pt-4"
              />
            );
          }}
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
