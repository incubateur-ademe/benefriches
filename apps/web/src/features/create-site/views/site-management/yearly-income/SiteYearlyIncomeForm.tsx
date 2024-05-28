import { ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  numberToString,
  stringToNumber,
} from "@/shared/services/number-conversion/numberConversion";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  operationsIncome: number;
  otherIncome: number;
};

function SiteYearlyIncomeForm({ onSubmit, onBack }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>();

  return (
    <WizardFormLayout title="Recettes annuelles liées à l'exploitation du site">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="operationsIncome"
          rules={{
            min: {
              value: 0,
              message: "Veuillez sélectionner un montant valide",
            },
          }}
          render={({ field }) => {
            return (
              <RowNumericInput
                state={formState.errors.operationsIncome ? "error" : "default"}
                stateRelatedMessage={formState.errors.operationsIncome?.message ?? undefined}
                nativeInputProps={{
                  name: field.name,
                  value: field.value ? numberToString(field.value) : undefined,
                  onChange: (ev: ChangeEvent<HTMLInputElement>) => {
                    field.onChange(stringToNumber(ev.target.value));
                  },
                  onBlur: field.onBlur,
                  type: "number",
                }}
                label="Recettes d'exploitation"
                hintInputText="€ / an"
                className="!tw-pt-4"
              />
            );
          }}
        />
        <Controller
          control={control}
          name="otherIncome"
          rules={{
            min: {
              value: 0,
              message: "Veuillez sélectionner un montant valide",
            },
          }}
          render={({ field }) => {
            return (
              <RowNumericInput
                state={formState.errors.otherIncome ? "error" : "default"}
                stateRelatedMessage={formState.errors.otherIncome?.message ?? undefined}
                nativeInputProps={{
                  name: field.name,
                  value: field.value ? numberToString(field.value) : undefined,
                  onChange: (ev: ChangeEvent<HTMLInputElement>) => {
                    field.onChange(stringToNumber(ev.target.value));
                  },
                  onBlur: field.onBlur,
                  type: "number",
                }}
                label="Autres recettes"
                hintInputText="€ / an"
                className="!tw-pt-4"
              />
            );
          }}
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default SiteYearlyIncomeForm;
