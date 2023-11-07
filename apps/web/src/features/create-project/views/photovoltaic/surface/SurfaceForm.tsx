import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

type Props = {
  onSubmit: (data: FormValues) => void;
  recommendedSurface: number;
  photovoltaicPower: number;
  siteSurfaceArea: number;
};

type FormValues = {
  photovoltaicSurface: number;
};

function PhotovoltaicSurfaceForm({
  onSubmit,
  photovoltaicPower,
  recommendedSurface,
  siteSurfaceArea,
}: Props) {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      photovoltaicSurface: recommendedSurface,
    },
  });

  const hintText = `en m² (maximum conseillé : ${formatNumberFr(
    siteSurfaceArea,
    0,
  )} m²)`;

  const maxErrorMessage = `La superficie des panneaux ne peut pas être supérieure à la superficie totale du site (${formatNumberFr(
    siteSurfaceArea,
    0,
  )} m²).`;

  return (
    <>
      <h2>
        Quel superficie du site occuperont les panneaux photovoltaïques&#8239;?
      </h2>
      <p>
        Le ratio superficie / puissance d’installation est de{" "}
        <strong>14000&#8239;m² pour 1000 kWc.</strong>
      </p>
      <p>
        Pour la puissance que vous avez renseigné (
        {formatNumberFr(photovoltaicPower, 0)}&#8239;kWh), la superficie occupée
        par les panneaux devrait donc être de{" "}
        {formatNumberFr(recommendedSurface)}&#8239;m².
      </p>
      <p>Vous pouvez modifier cette superficie.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          name="photovoltaicSurface"
          label="Superficie de l’installation"
          hintText={hintText}
          rules={{
            min: 0,
            max: {
              value: siteSurfaceArea,
              message: maxErrorMessage,
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

export default PhotovoltaicSurfaceForm;
