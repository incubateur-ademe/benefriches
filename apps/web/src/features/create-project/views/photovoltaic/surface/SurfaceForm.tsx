import { useForm } from "react-hook-form";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
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
  const { control, handleSubmit } = useForm<FormValues>();

  const hintText = `en m² (maximum : ${formatNumberFr(siteSurfaceArea)} m²)`;

  const maxErrorMessage = `La superficie des panneaux ne peut pas être supérieure à la superficie totale du site (${formatNumberFr(
    siteSurfaceArea,
  )} m²).`;

  return (
    <WizardFormLayout
      title="Quelle superficie du site occuperont les panneaux photovoltaïques ?"
      instructions={
        <>
          <p>
            La superficie d’installation des panneaux ne peut être supérieure à la superficie totale
            de la friche (<strong>{formatNumberFr(siteSurfaceArea)}</strong> m²).
          </p>

          <span className="fr-text--lg">💡</span>
          <p>
            Une centrale au sol peut facilement être implantée sur des espaces imperméabilisés (non
            bâtis) ou minéralisés, mais également sur des espaces enherbés ou avec de la végétation
            basse (broussailles, garrigue, etc.) qu’ils soient artificialisés ou naturels.
          </p>
          <p>
            Dès lors que de la végétation haute est présente (sols artificiels ou prairies arborés,
            forêts), l’implantation nécessite des investissements (coupes) et est à éviter (pour des
            raisons de biodiversité et de puits de carbone).
          </p>
          <p>Le devenir des sols sera abordés ultérieurement dans Bénéfriches.</p>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          name="photovoltaicInstallationSurfaceSquareMeters"
          label={<RequiredLabel label="Superficie de l’installation" />}
          hintText={hintText}
          rules={{
            min: 0,
            max: {
              value: siteSurfaceArea,
              message: maxErrorMessage,
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

export default PhotovoltaicSurfaceForm;
