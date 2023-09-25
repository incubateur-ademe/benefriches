import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { NaturalAreaSpaceType } from "../../../siteFoncier";

type Props = {
  onSubmit: (formValue: FormValues) => void;
};

type FormValues = Record<NaturalAreaSpaceType, boolean>;

const options = [
  { label: "Culture", value: NaturalAreaSpaceType.CULTIVATION },
  { label: "Verger", value: NaturalAreaSpaceType.ORCHARD },
  { label: "Vigne", value: NaturalAreaSpaceType.VINEYARD },
  { label: "Forêt", value: NaturalAreaSpaceType.FOREST },
  { label: "Prairie", value: NaturalAreaSpaceType.PRAIRIE },
  { label: "Zone humide", value: NaturalAreaSpaceType.WET_LAND },
  { label: "Plan d'eau", value: NaturalAreaSpaceType.WATER },
] as const;

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
