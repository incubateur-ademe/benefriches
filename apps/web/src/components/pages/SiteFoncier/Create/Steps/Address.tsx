import { FieldError, useFormContext } from "react-hook-form";

import { Input } from "@codegouvfr/react-dsfr/Input";

const KEY = "address";

function SiteFoncierCreationStepAddress() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[KEY] as FieldError;

  return (
    <>
      <h2>Où est située cette friche ?</h2>

      <Input
        label="Adresse du site"
        state={error ? "error" : "default"}
        stateRelatedMessage={error ? error.message : undefined}
        nativeInputProps={register(KEY, {
          required: "Ce champ est requis",
        })}
      />
    </>
  );
}

export default SiteFoncierCreationStepAddress;
