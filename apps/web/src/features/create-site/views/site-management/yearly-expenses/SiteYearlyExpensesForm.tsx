import { useFieldArray, useForm } from "react-hook-form";
import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Input } from "@codegouvfr/react-dsfr/Input";

export type FormValues = {
  rent?: number;
  propertyTaxes?: number;
  otherTaxes?: number;
  otherExpenses: { amount: number }[];
};

type Props = {
  hasTenant: boolean;
  onSubmit: (data: FormValues) => void;
};

const inputs = [
  {
    name: "rent",
    label: "Loyer",
    displayOnlyIfHasTenant: true,
  },
  {
    name: "propertyTaxes",
    label: "Taxe foncière",
    displayOnlyIfHasTenant: false,
  },
  {
    name: "otherTaxes",
    label: "Autre charge fiscale",
    displayOnlyIfHasTenant: true,
  },
] as const;

function SiteYearlyExpensesForm({ onSubmit, hasTenant }: Props) {
  const { register, handleSubmit, formState, control } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const { fields, append } = useFieldArray({
    name: "otherExpenses",
    control,
    shouldUnregister: true,
  });

  return (
    <>
      <h2>Dépenses annuelles liées à la gestion de la friche</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {inputs.map(({ name, label, displayOnlyIfHasTenant }) => {
          if (displayOnlyIfHasTenant && !hasTenant) {
            return null;
          }
          const error = formState.errors[name];
          return (
            <Input
              label={label}
              key={name}
              hintText="€ / an"
              state={error ? "error" : "default"}
              stateRelatedMessage={error ? error.message : undefined}
              nativeInputProps={register(name, {
                valueAsNumber: true,
                required: "Ce champ est requis",
              })}
            />
          );
        })}
        {fields.map((field, index) => {
          return (
            <Input
              label={`Autre dépense ${index + 1}`}
              key={field.id}
              hintText="€ / an"
              nativeInputProps={register(`otherExpenses.${index}.amount`, {
                valueAsNumber: true,
              })}
            />
          );
        })}
        <Button
          type="button"
          size="small"
          onClick={() => append({ amount: 0 })}
          className={fr.cx("fr-mb-4w")}
        >
          Ajouter une dépense
        </Button>
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

export default SiteYearlyExpensesForm;
