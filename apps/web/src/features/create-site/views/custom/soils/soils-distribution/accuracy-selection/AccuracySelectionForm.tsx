import { useForm } from "react-hook-form";

import { SurfaceAreaDistributionEntryMode } from "@/features/create-site/core/siteFoncier.types";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onBack: () => void;
  onSubmit: (data: FormValues) => void;
  isFriche: boolean;
};

export type FormValues = {
  accuracy: SurfaceAreaDistributionEntryMode;
};

function SiteSoilsDistributionAccuracySelectionForm({ onSubmit, onBack, isFriche }: Props) {
  const { handleSubmit, register, formState } = useForm<FormValues>();
  const _onSubmit = handleSubmit(onSubmit);

  const error = formState.errors.accuracy;

  return (
    <WizardFormLayout
      title={`Connaissez-vous les superficies des différents sols ${isFriche ? "de la friche" : "du site"} ?`}
    >
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
