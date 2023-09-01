import { FieldError, useFormContext } from "react-hook-form";

import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { ALLOWED_CATEGORIES } from "../StateMachine";

const KEY = "category";

function SiteFoncierCreationStepCategory() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[KEY] as FieldError;

  const options = ALLOWED_CATEGORIES.map((value) => ({
    label: value.charAt(0).toUpperCase() + value.slice(1),
    nativeInputProps: {
      value,
      ...register(KEY, {
        required:
          "Ce champ est nécessaire pour déterminer les questions suivantes",
      }),
    },
  }));

  return (
    <>
      <h2>De quel type de site s’agit-il ?</h2>

      <RadioButtons options={options} />

      {errors[KEY] && <p>{error.message}</p>}
    </>
  );
}

export default SiteFoncierCreationStepCategory;
