import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Input } from "@codegouvfr/react-dsfr/Input";

export type FormValues = {
  name: string;
  description?: string;
};

type Props = {
  onSubmit: (data: FormValues) => void;
};

function SiteNameAndDescriptionForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();

  const nameError = formState.errors.name;

  return (
    <>
      <h2>Dénomination du site</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Nom du site"
          hintText="Le nom du site tel qu’il est notoirement utilisé par les riverains."
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
    </>
  );
}

export default SiteNameAndDescriptionForm;
