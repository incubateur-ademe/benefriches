import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { getLabelForFricheSpaceType } from "./fricheSpaceTypeLabelMapping";

import { FricheSpaceType } from "@/features/create-site/domain/friche.types";

type FormValues = { spaces: FricheSpaceType[] };

type Props = {
  onSubmit: (data: FormValues) => void;
};

const options = Object.values(FricheSpaceType).map((type) => ({
  value: type,
  label: getLabelForFricheSpaceType(type),
}));

function FricheSpacesTypeForm({ onSubmit }: Props) {
  const { register, handleSubmit } = useForm<FormValues>();

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

  return (
    <>
      <h2>Quels types d'espaces y a-t-il sur cette friche ?</h2>
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

export default FricheSpacesTypeForm;
