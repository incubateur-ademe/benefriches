import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Input } from "@codegouvfr/react-dsfr/Input";

import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

export type FormValues = {
  name: string;
  description?: string;
};

type Props = {
  defaultProjectName: string;
  onSubmit: (data: FormValues) => void;
};

function ProjectNameAndDescriptionForm({ onSubmit, defaultProjectName }: Props) {
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
          label="Nom du projet"
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
        <ButtonsGroup
          buttonsEquisized
          inlineLayoutWhen="always"
          buttons={[
            {
              children: "Suivant",
              nativeButtonProps: { type: "submit" },
            },
          ]}
        />
      </form>
    </WizardFormLayout>
  );
}

export default ProjectNameAndDescriptionForm;
