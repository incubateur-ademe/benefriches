import { useForm } from "react-hook-form";
import { convertSquareMetersToHectares, PHOTOVOLTAIC_RATIO_M2_PER_KWC } from "shared";

import {
  formatNumberFr,
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowDecimalsNumericInput from "@/shared/views/components/form/NumericInput/RowDecimalsNumericInput";
import { requiredNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import FormAutoInfo from "@/shared/views/layout/WizardFormLayout/FormAutoInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  recommendedSurface: number;
  electricalPowerKWc: number;
  siteSurfaceArea: number;
};

type FormValues = {
  photovoltaicInstallationSurfaceSquareMeters: number;
};

function PhotovoltaicSurfaceFromPowerForm({
  initialValues,
  onSubmit,
  onBack,
  recommendedSurface,
  siteSurfaceArea,
}: Props) {
  const { register, handleSubmit, watch, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const hintText = `Maximum conseillé : ${formatSurfaceArea(siteSurfaceArea)}`;

  const maxErrorMessage = `La superficie des panneaux ne peut pas être supérieure à la superficie totale du site (${formatSurfaceArea(
    siteSurfaceArea,
  )}).`;

  const surface = watch("photovoltaicInstallationSurfaceSquareMeters");

  return (
    <WizardFormLayout
      title="Quelle superficie du site occuperont les panneaux photovoltaïques&nbsp;?"
      instructions={
        recommendedSurface === surface && (
          <FormAutoInfo>
            D’où vient la surface pré-remplie&nbsp;?
            <p>
              Le ratio superficie / puissance d'installation considéré est de{" "}
              <strong>
                {formatSurfaceArea(PHOTOVOLTAIC_RATIO_M2_PER_KWC * 1000)} pour 1 000 kWc.
              </strong>
            </p>
          </FormAutoInfo>
        )
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <RowDecimalsNumericInput
          addonText={SQUARE_METERS_HTML_SYMBOL}
          hintText={hintText}
          hintInputText={
            !isNaN(surface) && (
              <p>
                💡 Soit <strong>{formatNumberFr(convertSquareMetersToHectares(surface))}</strong>{" "}
                ha.
              </p>
            )
          }
          label={<RequiredLabel label="Superficie de l'installation" />}
          nativeInputProps={register("photovoltaicInstallationSurfaceSquareMeters", {
            ...requiredNumericFieldRegisterOptions,
            max: {
              value: siteSurfaceArea,
              message: maxErrorMessage,
            },
          })}
        />
        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default PhotovoltaicSurfaceFromPowerForm;
