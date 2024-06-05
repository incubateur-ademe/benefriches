import { Controller, useForm } from "react-hook-form";

import { PHOTOVOLTAIC_RATIO_M2_PER_KWC } from "@/features/create-project/domain/photovoltaic";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
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
const TOO_HIGH_VALUE_WARNING =
  "La puissance de l'installation est supérieure à la puissance calculée à partir de la surface d'occupation des panneaux.";
function PhotovoltaicPowerFromSurfaceForm({
  onSubmit,
  onBack,
  photovoltaicSurfaceArea,
  recommendedElectricalPowerKWc,
}: Props) {
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      photovoltaicInstallationElectricalPowerKWc: recommendedElectricalPowerKWc,
    },
  });

  const hintText = `Maximum conseillé : ${formatNumberFr(recommendedElectricalPowerKWc)} kWh`;

  const electricalPowerKwc = watch("photovoltaicInstallationElectricalPowerKWc");

  const displayTooHighValueWarning = electricalPowerKwc > recommendedElectricalPowerKWc;

  return (
    <WizardFormLayout
      title="Quelle sera la puissance de l'installation ?"
      instructions={
        <FormInfo>
          <p>
            Le ratio puissance / superficie d'installation considéré est de{" "}
            <strong>
              {formatNumberFr(10000 / PHOTOVOLTAIC_RATIO_M2_PER_KWC)}&nbsp;kWc pour 10 000 m².
            </strong>
          </p>
          <p>
            La superficie qu'occuperont les panneaux étant de{" "}
            {formatNumberFr(photovoltaicSurfaceArea)}
            &nbsp;m², votre puissance devrait être de{" "}
            {formatNumberFr(recommendedElectricalPowerKWc)}&nbsp;kWc.
          </p>
          <p>Vous pouvez modifier cette puissance.</p>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="photovoltaicInstallationElectricalPowerKWc"
          rules={{
            min: 0,
            required: "Ce champ est nécessaire pour déterminer les questions suivantes",
          }}
          render={(controller) => {
            return (
              <ControlledRowNumericInput
                {...controller}
                stateRelatedMessage={
                  displayTooHighValueWarning ? TOO_HIGH_VALUE_WARNING : undefined
                }
                state={displayTooHighValueWarning ? "warning" : "default"}
                label={<RequiredLabel label="Puissance de l'installation" />}
                hintText={hintText}
                hintInputText="en kWc"
                className="!tw-pt-4 tw-pb-6"
              />
            );
          }}
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default PhotovoltaicPowerFromSurfaceForm;
