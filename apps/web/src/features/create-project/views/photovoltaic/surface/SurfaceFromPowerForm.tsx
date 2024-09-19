import { Controller, useForm } from "react-hook-form";

import { PHOTOVOLTAIC_RATIO_M2_PER_KWC } from "@/features/create-project/domain/photovoltaic";
import { formatNumberFr, formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import { convertSquareMetersToHectares } from "@/shared/services/surface-area/surfaceArea";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import FormDefinition from "@/shared/views/layout/WizardFormLayout/FormDefinition";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
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
  onSubmit,
  onBack,
  electricalPowerKWc,
  recommendedSurface,
  siteSurfaceArea,
}: Props) {
  const { control, handleSubmit, watch, formState } = useForm<FormValues>({
    defaultValues: {
      photovoltaicInstallationSurfaceSquareMeters: recommendedSurface,
    },
  });

  const hintText = `en m² (maximum : ${formatSurfaceArea(siteSurfaceArea)})`;

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
        <Controller
          control={control}
          name="photovoltaicInstallationSurfaceSquareMeters"
          rules={{
            min: 1,
            required: "Ce champ est nécessaire pour déterminer les questions suivantes",
            max: {
              value: siteSurfaceArea,
              message: maxErrorMessage,
            },
          }}
          render={(controller) => {
            return (
              <ControlledRowNumericInput
                {...controller}
                label={<RequiredLabel label="Superficie de l'installation" />}
                hintText={hintText}
                hintInputText="en m²"
                className="!tw-pt-4"
              />
            );
          }}
        />
        {!isNaN(surface) && (
          <p>
            💡 Soit <strong>{formatNumberFr(convertSquareMetersToHectares(surface))}</strong> ha.
          </p>
        )}
        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default PhotovoltaicSurfaceFromPowerForm;
