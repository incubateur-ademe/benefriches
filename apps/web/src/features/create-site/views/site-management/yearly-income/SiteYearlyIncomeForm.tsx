import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
};

export type FormValues = {
  operationsIncome: number;
  otherIncome: number;
};

function SiteYearlyIncomeForm({ onSubmit }: Props) {
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
        <ButtonsGroup
          buttonsEquisized
          inlineLayoutWhen="always"
          buttons={[
            {
              children: "Suivant",
              nativeButtonProps: { type: "submit" },
            },
          ]}
        />
      </form>
    </WizardFormLayout>
  );
}

export default SiteYearlyIncomeForm;
