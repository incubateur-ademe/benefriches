import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { sumObjectValues } from "@/shared/services/sum/sum";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
};

export type FormValues = {
  rentAmount?: number;
  maintenanceAmount?: number;
  taxesAmount?: number;
  otherAmount?: number;
};

const YearlyProjectedCostsForm = ({ onSubmit }: Props) => {
  const { handleSubmit, control, watch } = useForm<FormValues>();

  const allCosts = watch();

  return (
    <WizardFormLayout title="Dépenses annuelles prévisionnelles">
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          control={control}
          label="Loyer"
          hintText="€"
          name="rentAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez sélectionner un montant valide",
            },
          }}
        />
        <NumericInput
          control={control}
          label="Maintenance"
          hintText="€"
          name="maintenanceAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez sélectionner un montant valide",
            },
          }}
        />
        <NumericInput
          control={control}
          label="Taxes et impôts"
          hintText="€"
          name="taxesAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez sélectionner un montant valide",
            },
          }}
        />
        <NumericInput
          control={control}
          label="Autres dépenses"
          hintText="€"
          name="otherAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez sélectionner un montant valide",
            },
          }}
        />
        <p>
          <strong>
            Total des dépenses annuelles : {formatNumberFr(sumObjectValues(allCosts))} €
          </strong>
        </p>
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
};

export default YearlyProjectedCostsForm;
