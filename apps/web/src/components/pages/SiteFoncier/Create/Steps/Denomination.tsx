import { FieldError, useFormContext } from "react-hook-form";

import { Input } from "@codegouvfr/react-dsfr/Input";

const NAME_KEY = "name";
const DESCRIPTION_TYPE = "description";

function SiteFoncierCreationStepDenomination() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const nameError = errors[NAME_KEY] as FieldError;
  const descriptionError = errors[DESCRIPTION_TYPE] as FieldError;

  return (
    <>
      <h2>Dénomination du site</h2>

      <Input
        label="Nom du site"
        state={nameError ? "error" : "default"}
        stateRelatedMessage={nameError ? nameError.message : undefined}
        nativeInputProps={register(NAME_KEY, {
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
        nativeTextAreaProps={register(DESCRIPTION_TYPE)}
      />
    </>
  );
}

export default SiteFoncierCreationStepDenomination;
