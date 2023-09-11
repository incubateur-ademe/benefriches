import { Controller, useFormContext } from "react-hook-form";

import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { ALLOWED_SURFACES_CATEGORIES } from "../../StateMachine";
import { ChangeEvent } from "react";
import { getSurfaceCategoryLabel } from "@/helpers/getLabelForValue";

const KEY = "surfaces";
const ERROR_MESSAGE =
  "Plusieurs réponses sont possibles. Si vous ne savez pas qualifier des espaces de la friche, sélectionner « Autre / NSP ». Vous pourrez revenir plus tard préciser votre réponse.";

type CustomCheckboxProps = {
  state: "default" | "error";
  stateRelatedMessage: typeof ERROR_MESSAGE | undefined;
  value: { category: string; superficie: string }[];
  onChange: (props: { category: string; superficie: string }[]) => void;
};

const CustomCheckbox = (props: CustomCheckboxProps) => {
  const { value = [], onChange, state, stateRelatedMessage } = props;

  const options = ALLOWED_SURFACES_CATEGORIES.map((key) => ({
    label: getSurfaceCategoryLabel(key),
    nativeInputProps: {
      checked: Boolean(value.find((element) => element.category === key)),
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
          return onChange([...value, { category: key, superficie: "0" }]);
        }
        onChange(value.filter((elem) => elem.category !== key));
      },
    },
  }));

  return (
    <Checkbox
      state={state}
      stateRelatedMessage={stateRelatedMessage}
      options={options}
    />
  );
};

function SiteFoncierCreationStepFricheSurfacesCategory() {
  const {
    formState: { errors },
    control,
    register,
  } = useFormContext();

  return (
    <>
      <h2>Quels espaces y a t-il sur cette friche ?</h2>

      <Controller
        render={({ field }) => (
          <CustomCheckbox
            {...field}
            state={errors[KEY] ? "error" : "default"}
            stateRelatedMessage={errors[KEY] ? ERROR_MESSAGE : undefined}
          />
        )}
        control={control}
        {...register("surfaces", { required: ERROR_MESSAGE })}
      />
    </>
  );
}

export default SiteFoncierCreationStepFricheSurfacesCategory;
