import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
};

export type FormValues = {
  accuracy: "percentage" | "square_meters" | "none";
};

function SiteSoilsDistributionAccuracySelectionForm({ onSubmit }: Props) {
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
              value: "percentage",
            },
            {
              label: "Non, je ne connais pas les superficies",
              value: "none",
            },
          ]}
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </WizardFormLayout>
  );
}

export default SiteSoilsDistributionAccuracySelectionForm;
