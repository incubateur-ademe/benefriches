import { useForm } from "react-hook-form";

import { SiteDraft } from "@/features/create-site/domain/siteFoncier.types";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onBack: () => void;
  onSubmit: (data: FormValues) => void;
};

export type FormValues = {
  accuracy: SiteDraft["soilsDistributionEntryMode"];
};

function SiteSoilsDistributionAccuracySelectionForm({ onSubmit, onBack }: Props) {
  const { handleSubmit, register, formState } = useForm<FormValues>();
  const _onSubmit = handleSubmit(onSubmit);

  const error = formState.errors.accuracy;

  return (
    <WizardFormLayout
      title="Connaissez-vous les superficies des différents sols de la friche existante ?"
      instructions={
        <p>
          En cochant « Non », Bénéfriches affectera une superficie égale à tous les types de sols.
        </p>
      }
    >
      <form onSubmit={_onSubmit}>
        <RadioButtons
          {...register("accuracy", {
            required: "Ce champ est requis pour déterminer l’étape suivante.",
          })}
          error={error}
          options={[
            {
              label: "Oui, je connais précisément les superficies, je peux les saisir en m²",
              value: "square_meters",
            },
            {
              label: "Oui, je connais approximativement les superficies, je peux les saisir en %",
              value: "total_surface_percentage",
            },
            {
              label: "Non, je ne connais pas les superficies",
              value: "default_even_split",
            },
          ]}
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default SiteSoilsDistributionAccuracySelectionForm;
