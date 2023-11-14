import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

type Props = {
  onSubmit: (data: FormValues) => void;
};

export type FormValues = {
  operationsAmount?: number;
  otherAmount?: number;
};

const sumAllRevenue = (costs: FormValues): number => {
  return Object.values(costs).reduce((sum, cost) => sum + (cost ?? 0), 0);
};

const ProjectYearlyProjectedRevenueForm = ({ onSubmit }: Props) => {
  const { handleSubmit, control, watch } = useForm<FormValues>();

  const allCosts = watch();

  return (
    <>
      <h2>Recettes annuelles prévisionnelles</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          control={control}
          label="Recettes d'exploitation"
          hintText="€ / an"
          name="operationsAmount"
        />
        <NumericInput
          control={control}
          label="Autres recettes"
          hintText="€ / an"
          name="otherAmount"
        />
        <p>
          <strong>
            Total des recettes annuelles :{" "}
            {formatNumberFr(sumAllRevenue(allCosts))} €
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

export default ProjectYearlyProjectedRevenueForm;
