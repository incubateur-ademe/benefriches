import { useForm } from "react-hook-form";
import { SiteNature } from "shared";

import { SurfaceAreaDistributionEntryMode } from "@/features/create-site/core/siteFoncier.types";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onBack: () => void;
  onSubmit: (data: FormValues) => void;
  siteNature?: SiteNature;
};

export type FormValues = {
  accuracy: SurfaceAreaDistributionEntryMode;
};

const getTitle = (siteNature: SiteNature | undefined) => {
  const baseTitle = `Connaissez-vous les superficies des différents sols`;
  switch (siteNature) {
    case "FRICHE":
      return `${baseTitle} de la friche ?`;
    case "AGRICULTURAL_OPERATION":
      return `${baseTitle} de l'exploitation ?`;
    case "NATURAL_AREA":
      return `${baseTitle} de l'espace naturel ?`;
    default:
      return `${baseTitle} du site ?`;
  }
};

function SiteSoilsDistributionAccuracySelectionForm({ onSubmit, onBack, siteNature }: Props) {
  const { handleSubmit, register, formState } = useForm<FormValues>();
  const _onSubmit = handleSubmit(onSubmit);

  const error = formState.errors.accuracy;

  return (
    <WizardFormLayout title={getTitle(siteNature)}>
      <form onSubmit={_onSubmit}>
        <RadioButtons
          {...register("accuracy", {
            required: "Ce champ est requis pour déterminer l'étape suivante.",
          })}
          error={error}
          options={
            [
              {
                label: `Oui, je connais les superficies, je peux les saisir en % ou en ${SQUARE_METERS_HTML_SYMBOL}`,
                value: "square_meters_or_percentage",
              },
              {
                label: "Non, je ne connais pas les superficies",
                value: "default_even_split",
                hintText: "Bénéfriches affectera une superficie égale à tous les types de sols.",
              },
            ] satisfies {
              label: string;
              value: SurfaceAreaDistributionEntryMode;
              hintText?: string;
            }[]
          }
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default SiteSoilsDistributionAccuracySelectionForm;
