import { Controller, useForm } from "react-hook-form";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import FormDefinition from "@/shared/views/layout/WizardFormLayout/FormDefinition";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  siteSurfaceArea: number;
};

type FormValues = {
  photovoltaicInstallationSurfaceSquareMeters: number;
};

function PhotovoltaicSurfaceForm({ onSubmit, siteSurfaceArea, onBack }: Props) {
  const { control, handleSubmit, watch } = useForm<FormValues>();

  const hintText = `Maximum : ${formatNumberFr(siteSurfaceArea)} m²`;

  const maxErrorMessage = `La superficie des panneaux ne peut pas être supérieure à la superficie totale du site (${formatNumberFr(
    siteSurfaceArea,
  )} m²).`;

  const surface = watch("photovoltaicInstallationSurfaceSquareMeters");

  const displayTooHighValueWarning = surface > siteSurfaceArea;

  return (
    <WizardFormLayout
      title="Quelle superficie du site occuperont les panneaux photovoltaïques ?"
      instructions={
        <>
          <p>
            La superficie d'installation des panneaux ne peut être supérieure à la superficie totale
            de la friche (<strong>{formatNumberFr(siteSurfaceArea)}</strong> m²).
          </p>

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
            min: 0,
            required: "Ce champ est nécessaire pour déterminer les questions suivantes",
          }}
          render={(controller) => {
            return (
              <ControlledRowNumericInput
                {...controller}
                stateRelatedMessage={displayTooHighValueWarning ? maxErrorMessage : undefined}
                state={displayTooHighValueWarning ? "warning" : "default"}
                label={<RequiredLabel label="Superficie de l'installation" />}
                hintText={hintText}
                hintInputText="en m²"
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

export default PhotovoltaicSurfaceForm;
