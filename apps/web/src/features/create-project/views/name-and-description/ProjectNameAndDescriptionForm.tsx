import { useForm } from "react-hook-form";
import { Input } from "@codegouvfr/react-dsfr/Input";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

export type FormValues = {
  name: string;
  description?: string;
};

type Props = {
  defaultProjectName: string;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

function ProjectNameAndDescriptionForm({ onSubmit, onBack, defaultProjectName }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      name: defaultProjectName,
    },
  });

  const nameError = formState.errors.name;

  return (
    <WizardFormLayout title="Dénomination du projet">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label={<RequiredLabel label="Nom du projet" />}
          hintText="Le nom du projet tel qu’il est courament utilisé par les collectivités."
          state={nameError ? "error" : "default"}
          stateRelatedMessage={nameError ? nameError.message : undefined}
          nativeInputProps={register("name", {
            required: "Ce champ est requis",
          })}
        />
        <Input
          label="Descriptif du projet"
          hintText="Décrivez succinctement le projet : contexte, objectif, état d’avancement..."
          textArea
          nativeTextAreaProps={register("description")}
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default ProjectNameAndDescriptionForm;
