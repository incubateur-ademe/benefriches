import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

type Props = {
  onSubmit: (data: FormValues) => void;
};

export type FormValues = {
  rentAmount?: number;
  maintenanceAmount?: number;
  taxesAmount?: number;
  otherAmount?: number;
};

const sumAmounts = (amounts: FormValues): number => {
  return Object.values(amounts).reduce((sum, amount) => sum + (amount ?? 0), 0);
};

const YearlyProjectedCostsForm = ({ onSubmit }: Props) => {
  const { handleSubmit, control, watch } = useForm<FormValues>();

  const allCosts = watch();

  return (
    <>
      <h2>Dépenses annuelles prévisionnelles</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          control={control}
          label="Loyer"
          hintText="€"
          name="rentAmount"
        />
        <NumericInput
          control={control}
          label="Maintenance"
          hintText="€"
          name="maintenanceAmount"
        />
        <NumericInput
          control={control}
          label="Taxes et impôts"
          hintText="€"
          name="taxesAmount"
        />
        <NumericInput
          control={control}
          label="Autres dépenses"
          hintText="€"
          name="otherAmount"
        />
        <p>
          <strong>
            Total des dépenses annuelles :{" "}
            {formatNumberFr(sumAmounts(allCosts))} €
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
    </>
  );
};

export default YearlyProjectedCostsForm;
