import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

type Props = {
  onSubmit: (data: FormValues) => void;
};

export type FormValues = {
  localOrRegionalAuthorityAmount?: number;
  publicSubsidiesAmount?: number;
  otherAmount?: number;
};

const sumAllRevenue = (costs: FormValues): number => {
  return Object.values(costs).reduce((sum, cost) => sum + (cost ?? 0), 0);
};

const ProjectFinancialAssistanceRevenueForm = ({ onSubmit }: Props) => {
  const { handleSubmit, control, watch } = useForm<FormValues>();

  const allCosts = watch();

  return (
    <>
      <h2>Aides financières aux travaux</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          control={control}
          label="Participation des collectivités"
          hintText="€"
          name="localOrRegionalAuthorityAmount"
        />
        <NumericInput
          control={control}
          label="Subvention publiques"
          hintText="€"
          name="publicSubsidiesAmount"
        />
        <NumericInput
          control={control}
          label="Autres ressources"
          hintText="€"
          name="otherAmount"
        />
        <p>
          <strong>
            Total des aides aux travaux :{" "}
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

export default ProjectFinancialAssistanceRevenueForm;
