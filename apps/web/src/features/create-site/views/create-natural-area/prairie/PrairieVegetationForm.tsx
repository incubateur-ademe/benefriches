import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { getLabelForVegetationType } from "./vegetationTypeLabelMapping";

import { VegetationType } from "@/features/create-site/domain/naturalArea.types";

type Props = {
  onSubmit: (formValue: FormValues) => void;
};

type FormValues = Record<VegetationType, boolean>;

const options = Object.values(VegetationType).map((vegetationType) => ({
  value: vegetationType,
  label: getLabelForVegetationType(vegetationType),
}));

function PrairieVegetationForm({ onSubmit }: Props) {
  const { handleSubmit, register } = useForm<FormValues>();

  const checkboxOptions = options.map((option) => ({
    label: option.label,
    nativeInputProps: register(option.value),
  }));

  return (
    <>
      <h2>Quels types de végétation y a-t-il sur la prairie ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Checkbox options={checkboxOptions} />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default PrairieVegetationForm;
