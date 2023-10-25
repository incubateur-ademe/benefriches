import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Input } from "@codegouvfr/react-dsfr/Input";

type Props = {
  onSubmit: (data: FormValues) => void;
};

export type FormValues = {
  operationsIncome: number;
  otherIncome: number;
};

const validatePositiveNumber = (value: number) => {
  if (isNaN(value) || value < 0) {
    return "La valeur renseignée doit être un nombre supérieur à zéro.";
  }
  return true;
};

function SiteYearlyIncomeForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();

  const errors = formState.errors;

  return (
    <>
      <h2>Recettes annuelles liées à l’exploitation du site</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Recettes d'exploitation"
          hintText="€ / an"
          state={errors.operationsIncome ? "error" : "default"}
          stateRelatedMessage={errors?.operationsIncome?.message}
          nativeInputProps={{
            ...register("operationsIncome", {
              required: "Ce champ est requis",
              valueAsNumber: true,
              validate: validatePositiveNumber,
            }),
          }}
        />
        <Input
          label="Autres recettes"
          hintText="€ / an"
          state={errors.otherIncome ? "error" : "default"}
          stateRelatedMessage={errors.otherIncome?.message}
          nativeInputProps={{
            ...register("otherIncome", {
              required: "Ce champ est requis",
              valueAsNumber: true,
              validate: validatePositiveNumber,
            }),
          }}
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
