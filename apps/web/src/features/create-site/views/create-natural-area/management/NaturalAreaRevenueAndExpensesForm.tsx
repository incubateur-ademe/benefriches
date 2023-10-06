import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Input } from "@codegouvfr/react-dsfr/Input";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = {
  profit: number;
  rentPaid: number;
};

const validatePositiveNumber = (value: number) => {
  if (isNaN(value) || value < 0) {
    return "La valeur renseignée doit être un nombre entier supérieur à zéro.";
  }
  return true;
};

function NaturalAreaProfitAndRentPaidForm({ onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();

  const profitError = formState.errors.profit;
  const rentPaidError = formState.errors.rentPaid;

  return (
    <>
      <h2>Coûts et recettes d'exploitation de l'espace naturel</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Bénéfice d'exploitation"
          hintText="€ / an"
          state={profitError ? "error" : "default"}
          stateRelatedMessage={profitError ? profitError.message : undefined}
          nativeInputProps={{
            type: "number",
            ...register("profit", {
              required: "Ce champ est requis",
              valueAsNumber: true,
              validate: validatePositiveNumber,
            }),
          }}
        />
        <Input
          label="Loyer"
          hintText="€ / an"
          state={rentPaidError ? "error" : "default"}
          stateRelatedMessage={
            rentPaidError ? rentPaidError.message : undefined
          }
          nativeInputProps={{
            type: "number",
            ...register("rentPaid", {
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
              children: "Retour",
              onClick: onBack,
              priority: "secondary",
              nativeButtonProps: { type: "button" },
            },
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

export default NaturalAreaProfitAndRentPaidForm;
