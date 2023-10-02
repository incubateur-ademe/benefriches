import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Input } from "@codegouvfr/react-dsfr/Input";

type Props = {
  onSubmit: (data: FormValues) => void;
};

type FormValues = {
  operationsIncome?: number;
  otherIncome?: number;
};

const validatePositiveNumber = (value: number | undefined) => {
  if (value === undefined || isNaN(value) || value < 0) {
    return "La valeur renseignée doit être un nombre supérieur à zéro.";
  }
  return true;
};

function NaturalAreaYearlyOperationExpensesForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();

  const {
    operationsIncome: operationsIncomeError,
    otherIncome: otherIncomeError,
  } = formState.errors;

  return (
    <>
      <h2>Recettes annuelles</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Recettes d'exploitation"
          hintText="€ / an"
          state={operationsIncomeError ? "error" : "default"}
          stateRelatedMessage={
            operationsIncomeError ? operationsIncomeError.message : undefined
          }
          nativeInputProps={{
            ...register("operationsIncome", {
              valueAsNumber: true,
              validate: validatePositiveNumber,
            }),
          }}
        />
        <Input
          label="Autres recettes"
          hintText="€ / an"
          state={otherIncomeError ? "error" : "default"}
          stateRelatedMessage={
            otherIncomeError ? otherIncomeError.message : undefined
          }
          nativeInputProps={{
            ...register("otherIncome", {
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
