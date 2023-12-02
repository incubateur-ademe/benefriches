import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

export type FormValues = {
  rent?: number;
  propertyTaxes?: number;
  otherTaxes?: number;
  otherExpense?: number;
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
  {
    name: "otherExpense",
    label: "Autres dépenses",
    displayOnlyIfHasTenant: false,
  },
] as const;

function SiteYearlyExpensesForm({ onSubmit, hasTenant }: Props) {
  const { handleSubmit, control } = useForm<FormValues>({
    shouldUnregister: true,
  });

  return (
    <WizardFormLayout title="Dépenses annuelles liées à la gestion du site">
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

export default SiteYearlyExpensesForm;
