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
  maxRecommendedElectricalPowerKWc: number;
  siteSurfaceArea: number;
};

type FormValues = {
  photovoltaicInstallationElectricalPowerKWc: number;
};

function PhotovoltaicPowerForm({
  onSubmit,
  onBack,
  siteSurfaceArea,
  maxRecommendedElectricalPowerKWc,
}: Props) {
  const { control, handleSubmit } = useForm<FormValues>();

  const hintText = `en kWc (maximum conseillé : ${formatNumberFr(
    maxRecommendedElectricalPowerKWc,
  )} kWc)`;

  return (
    <WizardFormLayout
      title="Quelle sera la puissance de l'installation ?"
      instructions={
        <>
          <p>
            Le ratio superficie / puissance d’installation considéré est de{" "}
            <strong>
              {formatNumberFr(PHOTOVOLTAIC_RATIO_M2_PER_KWC * 1000)}&nbsp;m² pour 1 000 kWc.
            </strong>
          </p>
          <p>
            La superficie du site étant de {formatNumberFr(siteSurfaceArea)}
            &nbsp;m², votre puissance devrait être de maximum{" "}
            {formatNumberFr(maxRecommendedElectricalPowerKWc)}&nbsp;kWc.
          </p>
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
              value: maxRecommendedElectricalPowerKWc,
              message:
                "La superficie induite par la puissance d’installation est supérieure à la superficie de la friche. Nous vous conseillons de réduire la puissance d’installation.",
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

export default PhotovoltaicPowerForm;
