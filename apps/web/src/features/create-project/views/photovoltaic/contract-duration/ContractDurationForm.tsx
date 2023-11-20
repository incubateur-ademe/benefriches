import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import { AVERAGE_PHOTOVOLTAIC_CONTRACT_DURATION_IN_YEARS } from "@/features/create-project/domain/photovoltaic";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

type Props = {
  onSubmit: (data: FormValues) => void;
};

type FormValues = {
  photovoltaicContractDuration: number;
};

function PhotovoltaicAnnualProductionForm({ onSubmit }: Props) {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      photovoltaicContractDuration:
        AVERAGE_PHOTOVOLTAIC_CONTRACT_DURATION_IN_YEARS,
    },
  });

  return (
    <>
      <h2>
        Quelle sera la durée du contrat de revente d’énergie au distributeur ?
      </h2>
      <p>
        La durée de contrat moyenne pour la revente de production photovoltaïque
        est de {AVERAGE_PHOTOVOLTAIC_CONTRACT_DURATION_IN_YEARS} ans.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          name="photovoltaicContractDuration"
          label="Durée du contrat de revente"
          hintText="en années"
          rules={{
            min: 2,
            required:
              "Ce champ est nécessaire pour déterminer les questions suivantes",
          }}
          control={control}
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default PhotovoltaicAnnualProductionForm;
