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
import FormDefinition from "@/shared/views/layout/WizardFormLayout/FormDefinition";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
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
  electricalPowerKWc,
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
      title="Quelle superficie fera l'installation ?"
      instructions={
        <>
          <FormInfo>
            <p>
              Le ratio superficie / puissance d'installation considéré est de{" "}
              <strong>
                {formatSurfaceArea(PHOTOVOLTAIC_RATIO_M2_PER_KWC * 1000)} pour 1 000 kWc.
              </strong>
            </p>
            <p>
              Pour la puissance que vous avez renseigné ({formatNumberFr(electricalPowerKWc)}
              &nbsp;kWc), la superficie occupée par les panneaux devrait donc être de{" "}
              {formatSurfaceArea(recommendedSurface)}.
            </p>
            <p>Vous pouvez modifier cette superficie.</p>

            <p>
              La superficie d'installation des panneaux ne peut être supérieure à la superficie
              totale de la friche ({formatSurfaceArea(siteSurfaceArea)}).
            </p>
          </FormInfo>

          <FormDefinition>
            <p>
              Une centrale au sol peut facilement être implantée sur des espaces imperméabilisés
              (non bâtis) ou minéralisés, mais également sur des espaces enherbés ou avec de la
              végétation basse (broussailles, garrigue, etc.) qu'ils soient artificialisés ou
              naturels.
            </p>
            <p>
              Dès lors que de la végétation haute est présente (sols artificiels ou prairies
              arborés, forêts), l'implantation nécessite des investissements (coupes) et est à
              éviter (pour des raisons de biodiversité et de puits de carbone).
            </p>
            <p>Le devenir des sols sera abordé plus loin dans le formulaire.</p>
          </FormDefinition>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <RowDecimalsNumericInput
          className="!tw-pt-4 tw-pb-6"
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
