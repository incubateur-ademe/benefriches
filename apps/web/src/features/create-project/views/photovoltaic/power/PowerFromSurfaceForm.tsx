import { useForm } from "react-hook-form";

import { PHOTOVOLTAIC_RATIO_M2_PER_KWC } from "@/features/create-project/domain/photovoltaic";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  recommendedElectricalPowerKWc: number;
  photovoltaicSurfaceArea: number;
};

type FormValues = {
  photovoltaicInstallationElectricalPowerKWc: number;
};

function PhotovoltaicPowerFromSurfaceForm({
  onSubmit,
  onBack,
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
      title="Quelle sera la puissance de l'installation ?"
      instructions={
        <>
          <p>
            Le ratio puissance / superficie d’installation considéré est de{" "}
            <strong>
              {formatNumberFr(10000 / PHOTOVOLTAIC_RATIO_M2_PER_KWC)}&nbsp;kWc pour 10 000 m².
            </strong>
          </p>
          <p>
            La superficie qu’occuperont les panneaux étant de{" "}
            {formatNumberFr(photovoltaicSurfaceArea)}
            &nbsp;m², votre puissance devrait être de{" "}
            {formatNumberFr(recommendedElectricalPowerKWc)}&nbsp;kWc.
          </p>
          <p>Vous pouvez modifier cette puissance.</p>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          name="photovoltaicInstallationElectricalPowerKWc"
          label={<RequiredLabel label="Puissance de l’installation" />}
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
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default PhotovoltaicPowerFromSurfaceForm;
