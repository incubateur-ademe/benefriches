import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

type Props = {
  onSubmit: (data: FormValues) => void;
};

export type FormValues = {
  worksCost?: number;
  technicalStudyCost?: number;
  otherCost?: number;
};

const sumAllCosts = (costs: FormValues): number => {
  return Object.values(costs).reduce((sum, cost) => sum + (cost ?? 0), 0);
};

const PhotovoltaicPanelsInstallationCostsForm = ({ onSubmit }: Props) => {
  const { handleSubmit, control, watch } = useForm<FormValues>();

  const allCosts = watch();

  return (
    <>
      <h2>Coûts d’installation des panneaux photovoltaïques</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          control={control}
          label="Travaux"
          hintText="€"
          name="worksCost"
        />
        <NumericInput
          control={control}
          label="Études et honoraires techniques"
          hintText="€"
          name="technicalStudyCost"
        />
        <NumericInput
          control={control}
          label="Frais divers"
          hintText="€"
          name="otherCost"
        />
        <p>
          <strong>
            Total des coûts d'installation :{" "}
            {formatNumberFr(sumAllCosts(allCosts))} €
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

export default PhotovoltaicPanelsInstallationCostsForm;
