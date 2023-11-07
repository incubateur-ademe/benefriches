import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

type Props = {
  onSubmit: (data: FormValues) => void;
  suggestedContractDuration: number;
};

type FormValues = {
  photovoltaic: {
    contractDuration: number;
  };
};

function PhotovoltaicAnnualProductionForm({
  suggestedContractDuration,
  onSubmit,
}: Props) {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      photovoltaic: {
        contractDuration: suggestedContractDuration,
      },
    },
  });

  return (
    <>
      <h2>
        Quelle sera la durée du contrat de revente d’énergie au distributeur ?
      </h2>
      <p>
        La durée de contrat moyenne pour la revente de production photovoltaïque
        est de 20 ans.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          name="photovoltaic.contractDuration"
          label="Durée du contrat de revente"
          hintText="en années"
          rules={{
            min: 0,
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
