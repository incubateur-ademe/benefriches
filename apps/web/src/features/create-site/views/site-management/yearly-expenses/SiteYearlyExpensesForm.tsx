import { useFieldArray, useForm } from "react-hook-form";
import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

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
  const { handleSubmit, control } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const { fields, append } = useFieldArray({
    name: "otherExpenses",
    control,
    shouldUnregister: true,
  });

  return (
    <>
      <h2>Dépenses annuelles liées à la gestion du site</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {inputs.map(({ name, label, displayOnlyIfHasTenant }) => {
          if (displayOnlyIfHasTenant && !hasTenant) {
            return null;
          }
          return (
            <NumericInput
              name={name}
              key={name}
              label={label}
              hintText="€ / an"
              control={control}
              rules={{
                min: {
                  value: 0,
                  message: "Veuillez sélectionner un montant valide",
                },
              }}
            />
          );
        })}
        {fields.map((field, index) => {
          return (
            <NumericInput
              name={`otherExpenses.${index}.amount`}
              label={`Autre dépense ${index + 1}`}
              key={field.id}
              hintText="€ / an"
              control={control}
              rules={{
                min: {
                  value: 0,
                  message: "Veuillez sélectionner un montant valide",
                },
              }}
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
