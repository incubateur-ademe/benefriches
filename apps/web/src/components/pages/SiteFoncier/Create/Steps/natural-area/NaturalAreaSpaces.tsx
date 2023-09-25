import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { NaturalAreaSpaceType } from "../../../siteFoncier";
import { getLabelForNaturalAreaSpaceType } from "./naturalAreaSpaceTypeLabelMapping";

type Props = {
  onSubmit: (formValue: FormValues) => void;
};

type FormValues = { spaces: NaturalAreaSpaceType[] };

const options = Object.values(NaturalAreaSpaceType).map((type) => ({
  value: type,
  label: getLabelForNaturalAreaSpaceType(type),
}));

function NaturalAreaSpacesForm({ onSubmit }: Props) {
  const { handleSubmit, register, formState } = useForm<FormValues>({
    defaultValues: {
      spaces: [],
    },
  });

  console.log({ formState });

  const checkboxOptions = options.map((option) => ({
    label: option.label,
    nativeInputProps: {
      ...register("spaces", {
        required:
          "Ce champ est nécessaire pour déterminer les questions suivantes",
      }),
      value: option.value,
    },
  }));

  const error = formState.errors.spaces;

  return (
    <>
      <h2>Quels types d'espaces y a-t-il sur ce site ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Checkbox
          options={checkboxOptions}
          state={error ? "error" : "default"}
          stateRelatedMessage={error ? error.message : undefined}
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default NaturalAreaSpacesForm;
