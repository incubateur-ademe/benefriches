import { useForm } from "react-hook-form";

import { PHOTOVOLTAIC_RATIO_M2_PER_KWC } from "@/features/create-project/core/renewable-energy/photovoltaic";
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
  siteSurfaceArea: number;
};

type FormValues = {
  photovoltaicInstallationElectricalPowerKWc: number;
};

function PhotovoltaicPowerForm({
  initialValues,
  onSubmit,
  onBack,
  siteSurfaceArea,
  recommendedElectricalPowerKWc,
}: Props) {
  const { handleSubmit, formState, register } = useForm<FormValues>({
    defaultValues: initialValues,
  });

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
            La superficie du site étant de {formatSurfaceArea(siteSurfaceArea)}, votre puissance
            devrait être de maximum {formatNumberFr(recommendedElectricalPowerKWc)}&nbsp;kWc.
          </p>
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

export default PhotovoltaicPowerForm;
