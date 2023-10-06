import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { getLabelForPermeableArtificialSoil } from "./permeableArtificializedSoilLabelMapping";

import { PermeableArtificializedSoil } from "@/features/create-site/domain/friche.types";

type FormValues = {
  composition: PermeableArtificializedSoil[];
};

type Props = {
  onSubmit: (data: FormValues) => void;
};

const options = Object.values(PermeableArtificializedSoil).map((type) => ({
  value: type,
  label: getLabelForPermeableArtificialSoil(type),
}));

function PermeableArtificialSoilCompositionForm({ onSubmit }: Props) {
  const { register, handleSubmit } = useForm<FormValues>();

  const checkboxOptions = options.map((option) => ({
    label: option.label,
    nativeInputProps: {
      ...register("composition"),
      value: option.value,
    },
  }));

  return (
    <>
      <h2>
        De quoi sont composés les{" "}
        <strong>sols artificialisés perméables</strong> ?
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Checkbox options={checkboxOptions} />
        <ButtonsGroup
          buttonsEquisized
          inlineLayoutWhen="always"
          buttons={[
            {
              children: "Suivant",
              nativeButtonProps: { type: "submit" },
            },
          ]}
        />
      </form>
    </>
  );
}

export default PermeableArtificialSoilCompositionForm;
