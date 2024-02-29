import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
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
  const { control, handleSubmit } = useForm<FormValues>();

  return (
    <WizardFormLayout title="Recettes annuelles liées à l’exploitation du site">
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          name="operationsIncome"
          label="Recettes d'exploitation"
          hintText="€ / an"
          rules={{
            min: {
              value: 0,
              message: "Veuillez sélectionner un montant valide",
            },
          }}
          control={control}
        />
        <NumericInput
          name="otherIncome"
          label="Autres recettes"
          hintText="€ / an"
          rules={{
            min: {
              value: 0,
              message: "Veuillez sélectionner un montant valide",
            },
          }}
          control={control}
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default SiteYearlyIncomeForm;
