import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { NaturalAreaSpaceType } from "../../../siteFoncier";
import { getLabelForNaturalAreaSpaceType } from "./naturalAreaSpaceTypeLabelMapping";

type Props = {
  onSubmit: (formValue: FormValues) => void;
};

type FormValues = Record<NaturalAreaSpaceType, boolean>;

const options = Object.values(NaturalAreaSpaceType).map((type) => ({
  value: type,
  label: getLabelForNaturalAreaSpaceType(type),
}));

function NaturalAreaSpacesForm({ onSubmit }: Props) {
  const { handleSubmit, register } = useForm<FormValues>();

  const checkboxOptions = options.map((option) => ({
    label: option.label,
    nativeInputProps: register(option.value),
  }));

  return (
    <>
      <h2>Quels types d'espaces y a-t-il sur ce site ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Checkbox options={checkboxOptions} />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default NaturalAreaSpacesForm;
