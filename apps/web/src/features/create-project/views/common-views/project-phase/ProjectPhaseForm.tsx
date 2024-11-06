import { useForm } from "react-hook-form";
import { ProjectPhase } from "shared";

import { getHintTextForProjectPhase, getLabelForProjectPhase } from "@/shared/domain/projectPhase";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: ProjectPhase) => void;
  onBack: () => void;
  excludedPhases?: ProjectPhase[];
};

export type FormValues = {
  phase?: ProjectPhase;
};

const options = (
  ["setup", "design", "construction", "planning", "completed", "unknown"] as const
).map((phase) => ({
  value: phase,
  label: getLabelForProjectPhase(phase),
  hintText: getHintTextForProjectPhase(phase) ?? undefined,
})) satisfies {
  value: ProjectPhase;
  label: string;
  hintText?: string;
}[];

function ProjectPhaseForm({ onSubmit, onBack, excludedPhases = [] }: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
  });

  return (
    <WizardFormLayout title="A quelle phase de votre projet êtes-vous ?">
      <form
        onSubmit={handleSubmit((formData: FormValues) => {
          onSubmit(formData.phase ?? "unknown");
        })}
      >
        <RadioButtons
          {...register("phase")}
          options={options.filter((phase) => !excludedPhases.includes(phase.value))}
          error={formState.errors.phase}
        />
        <BackNextButtonsGroup onBack={onBack} nextLabel={watch("phase") ? "Valider" : "Passer"} />
      </form>
    </WizardFormLayout>
  );
}

export default ProjectPhaseForm;
