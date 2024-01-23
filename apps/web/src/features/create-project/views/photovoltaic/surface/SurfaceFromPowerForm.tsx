import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import { PHOTOVOLTAIC_RATIO_M2_PER_KWC } from "@/features/create-project/domain/photovoltaic";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  recommendedSurface: number;
  electricalPowerKWc: number;
  siteSurfaceArea: number;
};

type FormValues = {
  photovoltaicInstallationSurfaceSquareMeters: number;
};

function PhotovoltaicSurfaceFromPowerForm({
  onSubmit,
  electricalPowerKWc,
  recommendedSurface,
  siteSurfaceArea,
}: Props) {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      photovoltaicInstallationSurfaceSquareMeters: recommendedSurface,
    },
  });

  const hintText = `en m² (maximum conseillé : ${formatNumberFr(siteSurfaceArea)} m²)`;

  const maxErrorMessage = `La superficie des panneaux ne peut pas être supérieure à la superficie totale du site (${formatNumberFr(
    siteSurfaceArea,
  )} m²).`;

  return (
    <WizardFormLayout
      title="Quelle superficie du site occuperont les panneaux photovoltaïques ?"
      instructions={
        <>
          <p>
            Le ratio superficie / puissance d’installation considéré est de{" "}
            <strong>
              {formatNumberFr(PHOTOVOLTAIC_RATIO_M2_PER_KWC * 1000)}&nbsp;m² pour 1 000 kWc.
            </strong>
          </p>
          <p>
            Pour la puissance que vous avez renseigné ({formatNumberFr(electricalPowerKWc)}
            &nbsp;kWc), la superficie occupée par les panneaux devrait donc être de{" "}
            {formatNumberFr(recommendedSurface)}
            &nbsp;m².
          </p>
          <p>Vous pouvez modifier cette superficie.</p>
        </>
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

export default PhotovoltaicSurfaceFromPowerForm;
