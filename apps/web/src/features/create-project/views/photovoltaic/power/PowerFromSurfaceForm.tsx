import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import { PHOTOVOLTAIC_RATIO_KWC_PER_M2 } from "@/features/create-project/domain/photovoltaic";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  recommendedElectricalPowerKWc: number;
  photovoltaicSurfaceArea: number;
};

type FormValues = {
  photovoltaicInstallationElectricalPowerKWc: number;
};

function PhotovoltaicPowerFromSurfaceForm({
  onSubmit,
  photovoltaicSurfaceArea,
  recommendedElectricalPowerKWc,
}: Props) {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      photovoltaicInstallationElectricalPowerKWc: recommendedElectricalPowerKWc,
    },
  });

  const hintText = `en kWc (maximum conseillé : ${formatNumberFr(
    recommendedElectricalPowerKWc,
  )} kWh)`;

  return (
    <WizardFormLayout
      title="Quel sera la puissance de votre installation ?"
      instructions={
        <>
          {" "}
          <p>
            Le ratio puissance / superficie d’installation considéré est de{" "}
            <strong>
              {formatNumberFr(PHOTOVOLTAIC_RATIO_KWC_PER_M2 * 10000)}&nbsp;kWc pour 10 000 m².
            </strong>
          </p>
          <p>
            La superficie qu’occuperont les panneaux étant de{" "}
            {formatNumberFr(photovoltaicSurfaceArea)}
            &nbsp;m², votre puissance devrait être de{" "}
            {formatNumberFr(recommendedElectricalPowerKWc)}&nbsp;kWc.
          </p>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          name="photovoltaicInstallationElectricalPowerKWc"
          label="Puissance de l’installation"
          hintText={hintText}
          rules={{
            min: 0,
            max: {
              value: recommendedElectricalPowerKWc,
              message:
                "La puissance de l’installation est supérieure à la puissance calculée à partir de la surface d’occupation des panneaux.",
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

export default PhotovoltaicPowerFromSurfaceForm;
