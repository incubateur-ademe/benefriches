import { Controller, useForm } from "react-hook-form";
import { typedObjectEntries } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
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
  const { control, handleSubmit, watch } = useForm<FormValues>();

  const formValues = watch();

  const hasNoValuesFilled =
    typedObjectEntries(formValues).filter(([, value]) => typeof value === "number").length === 0;

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
          render={(controller) => {
            return (
              <ControlledRowNumericInput
                {...controller}
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
          render={(controller) => {
            return (
              <ControlledRowNumericInput
                {...controller}
                label="Autres recettes"
                hintInputText="€ / an"
                className="!tw-pt-4"
              />
            );
          }}
        />
        <BackNextButtonsGroup
          onBack={onBack}
          nextLabel={hasNoValuesFilled ? "Passer" : "Valider"}
        />
      </form>
    </WizardFormLayout>
  );
}

export default SiteYearlyIncomeForm;
