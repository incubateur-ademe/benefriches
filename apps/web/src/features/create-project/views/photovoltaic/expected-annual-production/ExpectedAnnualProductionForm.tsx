import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

type Props = {
  onSubmit: (data: FormValues) => void;
  suggestedAnnualProductionInMegaWattPerYear: number;
};

type FormValues = {
  photovoltaicExpectedAnnualProduction: number;
};

function PhotovoltaicAnnualProductionForm({
  onSubmit,
  suggestedAnnualProductionInMegaWattPerYear,
}: Props) {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      photovoltaicExpectedAnnualProduction:
        suggestedAnnualProductionInMegaWattPerYear,
    },
  });

  return (
    <>
      <h2>
        Quelle est la production annuelle attendue de votre installation ?
      </h2>
      <p>
        D’après le taux d’ensoleillement moyen en France et à partir de la
        puissance de vos futurs panneaux, vous pouvez attendre une production
        annuelle de {formatNumberFr(suggestedAnnualProductionInMegaWattPerYear)}{" "}
        MWh/an.
      </p>
      <p>Vous pouvez modifier cette valeur.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          name="photovoltaicExpectedAnnualProduction"
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
