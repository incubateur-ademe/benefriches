import { useForm } from "react-hook-form";
import { Input } from "@codegouvfr/react-dsfr/Input";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

type FormValues = {
  name: string;
  description?: string;
};

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

function PrairieDenominationStep({ onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();
  const _onSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  const nameError = formState.errors.name;
  const descriptionError = formState.errors.description;

  return (
    <>
      <h2>Dénomination du site</h2>

      <form onSubmit={_onSubmit}>
        <Input
          label="Nom du site"
          state={nameError ? "error" : "default"}
          stateRelatedMessage={nameError ? nameError.message : undefined}
          nativeInputProps={register("name", {
            required: "Ce champ est requis",
          })}
        />
        <Input
          label="Descriptif du site"
          textArea
          state={descriptionError ? "error" : "default"}
          stateRelatedMessage={
            descriptionError ? descriptionError.message : undefined
          }
          nativeTextAreaProps={register("description")}
        />
        <ButtonsGroup
          buttonsEquisized
          inlineLayoutWhen="always"
          buttons={[
            {
              children: "Retour",
              onClick: onBack,
              priority: "secondary",
              nativeButtonProps: { type: "button" },
            },
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

export default PrairieDenominationStep;
