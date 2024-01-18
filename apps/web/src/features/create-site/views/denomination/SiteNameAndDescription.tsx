import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Input } from "@codegouvfr/react-dsfr/Input";

import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

export type FormValues = {
  name: string;
  description?: string;
};

type Props = {
  defaultSiteName: string;
  onSubmit: (data: FormValues) => void;
};

function SiteNameAndDescriptionForm({ onSubmit, defaultSiteName }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      name: defaultSiteName,
    },
  });

  const nameError = formState.errors.name;

  return (
    <WizardFormLayout title="Dénomination du site">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Nom du site"
          hintText="Le nom du site tel qu’il est courament utilisé par les riverains."
          state={nameError ? "error" : "default"}
          stateRelatedMessage={nameError ? nameError.message : undefined}
          nativeInputProps={register("name", {
            required: "Ce champ est requis",
          })}
        />
        <Input
          label="Descriptif du site"
          hintText="Vous pouvez décrire l’activité du site, historique ou actuelle."
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

export default SiteNameAndDescriptionForm;
