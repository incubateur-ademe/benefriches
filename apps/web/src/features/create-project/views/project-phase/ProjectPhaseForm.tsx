import { useForm } from "react-hook-form";
import { ProjectPhase } from "shared";

import {
  getHintTextForPhotovoltaicProjectPhase,
  getLabelForPhotovoltaicProjectPhase,
} from "@/shared/domain/photovoltaicPowerStationProject";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  phase: ProjectPhase;
};

const requiredMessage = "Veuillez sélectionner l'avancement du projet.";

const options = (["setup", "design", "construction", "completed", "unknown"] as const).map(
  (phase) => ({
    value: phase,
    label: getLabelForPhotovoltaicProjectPhase(phase),
    hintText: getHintTextForPhotovoltaicProjectPhase(phase) ?? undefined,
  }),
) satisfies {
  value: ProjectPhase;
  label: string;
  hintText?: string;
}[];

function ProjectPhaseForm({ onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    shouldUnregister: true,
  });

  return (
    <WizardFormLayout title="A quelle phase de votre projet êtes-vous ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("phase", {
            required: requiredMessage,
          })}
          options={options}
          error={formState.errors.phase}
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default ProjectPhaseForm;
