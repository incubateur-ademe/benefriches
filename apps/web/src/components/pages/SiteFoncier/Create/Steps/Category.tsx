import { useFormContext } from "react-hook-form";

import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { SiteFoncierType } from "../../siteFoncier";

const KEY = "category";

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

function SiteFoncierCreationStepCategory() {
  const { register, formState } = useFormContext<{ category: string }>();

  const error = formState.errors.category;

  const options = Object.values(SiteFoncierType).map((value) => ({
    label: capitalize(value),
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

      <RadioButtons
        options={options}
        state={error ? "error" : "default"}
        stateRelatedMessage={error ? error.message : undefined}
      />
    </>
  );
}

export default SiteFoncierCreationStepCategory;
