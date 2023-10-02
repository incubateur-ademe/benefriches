import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Input } from "@codegouvfr/react-dsfr/Input";

type Props = {
  askForRent: boolean;
  onSubmit: (data: FormValues) => void;
};

type FormValues = {
  rent?: number;
  taxes?: number;
  otherExpenses?: number;
};

const validatePositiveNumber = (value: number | undefined) => {
  if (value === undefined || isNaN(value) || value < 0) {
    return "La valeur renseignée doit être un nombre supérieur à zéro.";
  }
  return true;
};

function NaturalAreaYearlyOperationExpensesForm({
  onSubmit,
  askForRent,
}: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();

  const {
    rent: rentError,
    taxes: taxesError,
    otherExpenses: otherExpensesError,
  } = formState.errors;

  return (
    <>
      <h2>
        Emplois temps plein mobilisés pour l'exploitation de l'espace naturel
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {askForRent && (
          <Input
            label="Loyer"
            hintText="€ / an"
            state={rentError ? "error" : "default"}
            stateRelatedMessage={rentError ? rentError.message : undefined}
            nativeInputProps={{
              ...register("rent", {
                valueAsNumber: true,
                validate: validatePositiveNumber,
              }),
            }}
          />
        )}
        <Input
          label="Charges fiscales"
          hintText="€ / an"
          state={taxesError ? "error" : "default"}
          stateRelatedMessage={taxesError ? taxesError.message : undefined}
          nativeInputProps={{
            ...register("taxes", {
              valueAsNumber: true,
              validate: validatePositiveNumber,
            }),
          }}
        />
        <Input
          label="Autres dépenses"
          hintText="€ / an"
          state={otherExpensesError ? "error" : "default"}
          stateRelatedMessage={
            otherExpensesError ? otherExpensesError.message : undefined
          }
          nativeInputProps={{
            ...register("otherExpenses", {
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

export default NaturalAreaYearlyOperationExpensesForm;
