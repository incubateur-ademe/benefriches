import { FieldError, useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props<T> = {
  projectPhaseOptions: { value: T; label: string; hintText?: string }[];
  onSubmit: (data: FormValues<T>) => void;
  onBack: () => void;
};

export type FormValues<T> = {
  phase?: T;
};

function ProjectPhaseForm<TProjectPhase extends string>({
  projectPhaseOptions,
  onSubmit,
  onBack,
}: Props<TProjectPhase>) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues<TProjectPhase>>();

  return (
    <WizardFormLayout title="A quelle phase du projet êtes-vous ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("phase")}
          options={projectPhaseOptions}
          error={formState.errors.phase as FieldError}
        />
        <BackNextButtonsGroup onBack={onBack} nextLabel={watch("phase") ? "Valider" : "Passer"} />
      </form>
    </WizardFormLayout>
  );
}

export default ProjectPhaseForm;
