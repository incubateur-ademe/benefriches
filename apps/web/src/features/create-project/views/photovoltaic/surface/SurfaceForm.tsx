import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

type Props = {
  onSubmit: (data: FormValues) => void;
  siteSurfaceArea: number;
};

type FormValues = {
  photovoltaicSurface: number;
};

function PhotovoltaicSurfaceForm({ onSubmit, siteSurfaceArea }: Props) {
  const { control, handleSubmit } = useForm<FormValues>();

  const hintText = `en m² (maximum : ${formatNumberFr(siteSurfaceArea)} m²)`;

  const maxErrorMessage = `La superficie des panneaux ne peut pas être supérieure à la superficie totale du site (${formatNumberFr(
    siteSurfaceArea,
  )} m²).`;

  return (
    <>
      <h2>
        Quel superficie du site occuperont les panneaux photovoltaïques&#8239;?
      </h2>

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