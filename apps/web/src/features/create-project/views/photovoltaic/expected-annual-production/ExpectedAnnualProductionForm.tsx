import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

type Props = {
  onSubmit: (data: FormValues) => void;
  suggestedAnnualProduction: number;
};

type FormValues = {
  photovoltaic: {
    expectedAnnualProduction: number;
  };
};

function PhotovoltaicAnnualProductionForm({
  onSubmit,
  suggestedAnnualProduction,
}: Props) {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      photovoltaic: {
        expectedAnnualProduction: suggestedAnnualProduction,
      },
    },
  });

  return (
    <>
      <h2>
        Quelle est la production annuelle attendue de votre installation ?
      </h2>
      <p>
        Production calculée à partir de la puissance, de la superficie au sol et
        du taux d’ensoleillement dans la zone géographique du site.
      </p>
      <p>Vous pouvez la modifier.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          name="photovoltaic.expectedAnnualProduction"
          label="Production attendue de l’installation"
          hintText="en MWh/an"
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
