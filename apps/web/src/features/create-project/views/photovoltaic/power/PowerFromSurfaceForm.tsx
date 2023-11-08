import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

type Props = {
  onSubmit: (data: FormValues) => void;
  maxRecommendedPower: number;
  photovoltaicSurfaceArea: number;
  computationRatio: number;
};

type FormValues = {
  photovoltaic: {
    power: number;
  };
};

function PhotovoltaicPowerFromSurfaceForm({
  onSubmit,
  photovoltaicSurfaceArea,
  maxRecommendedPower,
  computationRatio,
}: Props) {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      photovoltaic: {
        power: maxRecommendedPower,
      },
    },
  });

  const hintText = `en kWc (maximum conseillé : ${formatNumberFr(
    maxRecommendedPower,
  )} kWh)`;

  return (
    <>
      <h2>Quel sera la puissance de votre installation ?</h2>
      <p>
        Le ratio puissance / superficie d’installation est de{" "}
        <strong>{computationRatio * 10000}&#8239;kWc pour 10 000 m².</strong>
      </p>
      <p>
        La superficie qu’occuperont les panneaux étant de{" "}
        {formatNumberFr(photovoltaicSurfaceArea)}
        &#8239;m², votre puissance devrait être de{" "}
        {formatNumberFr(maxRecommendedPower)}&#8239;kWc.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          name="photovoltaic.power"
          label="Puissance de l’installation"
          hintText={hintText}
          rules={{
            min: 0,
            max: {
              value: maxRecommendedPower,
              message:
                "La puissance de l’installation est supérieure à la puissance calculée à partir de la surface d’occupation des panneaux.",
            },
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

export default PhotovoltaicPowerFromSurfaceForm;
