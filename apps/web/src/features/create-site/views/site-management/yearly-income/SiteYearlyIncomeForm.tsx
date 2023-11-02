import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

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
    <>
      <h2>Recettes annuelles liées à l’exploitation du site</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          name="operationsIncome"
          label="Recettes d'exploitation"
          hintText="€ / an"
          rules={{ required: "Ce champ est requis" }}
          control={control}
        />
        <NumericInput
          name="otherIncome"
          label="Autres recettes"
          hintText="€ / an"
          rules={{ required: "Ce champ est requis" }}
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
    </>
  );
}

export default SiteYearlyIncomeForm;
