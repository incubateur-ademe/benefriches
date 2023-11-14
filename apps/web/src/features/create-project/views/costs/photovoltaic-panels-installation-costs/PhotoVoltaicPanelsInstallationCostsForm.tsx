import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

type Props = {
  onSubmit: (data: FormValues) => void;
};

export type FormValues = {
  worksAmount?: number;
  technicalStudyAmount?: number;
  otherAmount?: number;
};

const sumAmounts = (amounts: FormValues): number => {
  return Object.values(amounts).reduce((sum, amount) => sum + (amount ?? 0), 0);
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
          name="worksAmount"
        />
        <NumericInput
          control={control}
          label="Études et honoraires techniques"
          hintText="€"
          name="technicalStudyAmount"
        />
        <NumericInput
          control={control}
          label="Frais divers"
          hintText="€"
          name="otherAmount"
        />
        <p>
          <strong>
            Total des coûts d'installation :{" "}
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

export default PhotovoltaicPanelsInstallationCostsForm;
