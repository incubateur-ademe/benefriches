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
  const descriptionError = errors[NAME_KEY] as FieldError;

  return (
    <>
      <h2>Dénomination du site</h2>

      <Input
        label="Nom du site"
        state="default"
        nativeInputProps={register(NAME_KEY, {
          required: "Ce champ est requis",
        })}
      />
      {nameError && <p>{nameError.message}</p>}

      <Input
        label="Descriptif du site"
        textArea
        nativeTextAreaProps={register(DESCRIPTION_TYPE)}
      />
      {descriptionError && <p>{descriptionError.message}</p>}
    </>
  );
}

export default SiteFoncierCreationStepDenomination;
