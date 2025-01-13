import { useForm } from "react-hook-form";

import { PHOTOVOLTAIC_RATIO_M2_PER_KWC } from "@/features/create-project/domain/photovoltaic";
import { formatNumberFr, formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import { requiredNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  recommendedElectricalPowerKWc: number;
  photovoltaicSurfaceArea: number;
};

type FormValues = {
  photovoltaicInstallationElectricalPowerKWc: number;
};

function PhotovoltaicPowerFromSurfaceForm({
  initialValues,
  onSubmit,
  onBack,
  photovoltaicSurfaceArea,
  recommendedElectricalPowerKWc,
}: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const hintText = `Maximum conseillé : ${formatNumberFr(recommendedElectricalPowerKWc)} kWh`;

  return (
    <WizardFormLayout
      title="Quelle sera la puissance de l'installation ?"
      instructions={
        <FormInfo>
          <p>
            Le ratio puissance / superficie d'installation considéré est de{" "}
            <strong>
              {formatNumberFr(10000 / PHOTOVOLTAIC_RATIO_M2_PER_KWC)}&nbsp;kWc pour{" "}
              {formatSurfaceArea(10000)}.
            </strong>
          </p>
          <p>
            La superficie qu'occuperont les panneaux étant de{" "}
            {formatSurfaceArea(photovoltaicSurfaceArea)}, votre puissance devrait être de{" "}
            {formatNumberFr(recommendedElectricalPowerKWc)}&nbsp;kWc.
          </p>
          <p>Vous pouvez modifier cette puissance.</p>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <RowNumericInput
          className="!tw-pt-4 tw-pb-6"
          addonText="kWc"
          hintText={hintText}
          label={<RequiredLabel label="Puissance de l'installation" />}
          nativeInputProps={register(
            "photovoltaicInstallationElectricalPowerKWc",
            requiredNumericFieldRegisterOptions,
          )}
        />

        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default PhotovoltaicPowerFromSurfaceForm;
