import { Controller, useForm } from "react-hook-form";

import { PHOTOVOLTAIC_RATIO_M2_PER_KWC } from "@/features/create-project/domain/photovoltaic";
import { formatNumberFr, formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  recommendedElectricalPowerKWc: number;
  siteSurfaceArea: number;
};

type FormValues = {
  photovoltaicInstallationElectricalPowerKWc: number;
};

function PhotovoltaicPowerForm({
  onSubmit,
  onBack,
  siteSurfaceArea,
  recommendedElectricalPowerKWc,
}: Props) {
  const { control, handleSubmit } = useForm<FormValues>();

  const hintText = `Maximum conseillé : ${formatNumberFr(recommendedElectricalPowerKWc)} kWc`;

  return (
    <WizardFormLayout
      title="Quelle sera la puissance de l'installation ?"
      instructions={
        <FormInfo>
          <p>
            Le ratio superficie / puissance d'installation considéré est de{" "}
            <strong>
              {formatSurfaceArea(PHOTOVOLTAIC_RATIO_M2_PER_KWC * 1000)} pour 1 000 kWc.
            </strong>
          </p>
          <p>
            La superficie du site étant de {formatNumberFr(siteSurfaceArea)}
            &nbsp;m², votre puissance devrait être de maximum{" "}
            {formatNumberFr(recommendedElectricalPowerKWc)}&nbsp;kWc.
          </p>
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

export default PhotovoltaicPowerForm;
