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
  defaultSiteName: string;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

function SiteNameAndDescriptionForm({ onSubmit, onBack, defaultSiteName }: Props) {
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
          label={<RequiredLabel label="Nom du site" />}
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
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default SiteNameAndDescriptionForm;
