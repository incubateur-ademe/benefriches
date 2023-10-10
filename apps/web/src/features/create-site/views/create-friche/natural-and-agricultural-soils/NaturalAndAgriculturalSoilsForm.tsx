import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { getLabelForFricheSoilType } from "../soilTypeLabelMapping";

import { FricheSoilType } from "@/features/create-site/domain/friche.types";

const options = [
  FricheSoilType.FOREST_DECIDUOUS,
  FricheSoilType.FOREST_CONIFER,
  FricheSoilType.FOREST_POPLAR,
  FricheSoilType.FOREST_MIXED,
  FricheSoilType.PRAIRIE_GRASS,
  FricheSoilType.PRAIRIE_BUSHES,
  FricheSoilType.PRAIRIE_TREES,
  FricheSoilType.ORCHARD,
  FricheSoilType.CULTIVATION,
  FricheSoilType.VINEYARD,
  FricheSoilType.WET_LAND,
  FricheSoilType.WATER,
  FricheSoilType.UNKNOWN_NATURAL_AREA,
] as const;

type FricheNaturalAndAgriculturalSoilTypeOption = (typeof options)[number];

export type FormValues = {
  soils: FricheNaturalAndAgriculturalSoilTypeOption[];
};

type Props = {
  onSubmit: (data: FormValues) => void;
};

function NaturalAndAgriculturalSoilsForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();

  const checkboxOptions = options.map((soilType) => ({
    label: getLabelForFricheSoilType(soilType),
    nativeInputProps: {
      ...register("soils", {
        required:
          "Ce champ est nécessaire pour déterminer les questions suivantes",
      }),
      value: soilType,
    },
  }));

  const validationError = formState.errors.soils;

  return (
    <>
      <h2>
        Quels types d'espaces naturels ou agricoles y a-t-il sur cette friche ?
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Checkbox
          options={checkboxOptions}
          state={validationError ? "error" : "default"}
          stateRelatedMessage={
            validationError ? validationError.message : undefined
          }
        />
        <ButtonsGroup
          buttonsEquisized
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

export default NaturalAndAgriculturalSoilsForm;
