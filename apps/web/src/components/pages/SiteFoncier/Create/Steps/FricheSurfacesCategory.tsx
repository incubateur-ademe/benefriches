import { Controller, useFormContext } from "react-hook-form";

import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { ALLOWED_SURFACES_CATEGORIES } from "../StateMachine";
import { ChangeEvent } from "react";
import { getSurfaceCategoryLabel } from "@/helpers/getLabelForValue";

const KEY = "surfaces";
const ERROR_MESSAGE =
  "Plusieurs réponses sont possibles. Si vous ne savez pas qualifier des espaces de la friche, sélectionner « Autre / NSP ». Vous pourrez revenir plus tard préciser votre réponse.";

type CustomCheckboxProps = {
  value: { category: string; superficie: string }[];
  onChange: (props: { category: string; superficie: string }[]) => void;
};

const CustomCheckbox = (props: CustomCheckboxProps) => {
  const value = props.value || [];
  const onChange = props.onChange;

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

  return <Checkbox options={options} state="default" />;
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
        render={({ field }) => <CustomCheckbox {...field} />}
        control={control}
        {...register("surfaces", { required: ERROR_MESSAGE })}
      />

      {errors[KEY] && <p>{ERROR_MESSAGE}</p>}
    </>
  );
}

export default SiteFoncierCreationStepFricheSurfacesCategory;
