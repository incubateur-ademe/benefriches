import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  siteSurfaceArea: number;
};

type FormValues = {
  photovoltaicInstallationSurfaceSquareMeters: number;
};

function PhotovoltaicSurfaceForm({ onSubmit, siteSurfaceArea }: Props) {
  const { control, handleSubmit } = useForm<FormValues>();

  const hintText = `en m² (maximum : ${formatNumberFr(siteSurfaceArea)} m²)`;

  const maxErrorMessage = `La superficie des panneaux ne peut pas être supérieure à la superficie totale du site (${formatNumberFr(
    siteSurfaceArea,
  )} m²).`;

  return (
    <WizardFormLayout
      title="Quelle superficie du site occuperont les panneaux photovoltaïques ?"
      instructions={
        <p>
          Le site fait <strong>{formatNumberFr(siteSurfaceArea)}</strong> m²
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          name="photovoltaicInstallationSurfaceSquareMeters"
          label={<RequiredLabel label="Superficie de l’installation" />}
          hintText={hintText}
          rules={{
            min: 0,
            max: {
              value: siteSurfaceArea,
              message: maxErrorMessage,
            },
            required: "Ce champ est nécessaire pour déterminer les questions suivantes",
          }}
          control={control}
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </WizardFormLayout>
  );
}

export default PhotovoltaicSurfaceForm;
