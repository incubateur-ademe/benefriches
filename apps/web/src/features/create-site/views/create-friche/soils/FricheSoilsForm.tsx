import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { getLabelForFricheSoilType } from "../soilTypeLabelMapping";

import { FricheSoilType } from "@/features/create-site/domain/friche.types";

export type FormValues = {
  soils: FricheSoilTypeOption[];
};

type Props = {
  onSubmit: (data: FormValues) => void;
};

export const NATURAL_OR_AGRICULTURAL_SOILS = "NATURAL_OR_AGRICULTURAL_SOILS";

const options = [
  FricheSoilType.BUILDINGS,
  FricheSoilType.IMPERMEABLE_SOILS,
  FricheSoilType.MINERAL_SOIL,
  FricheSoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
  FricheSoilType.ARTIFICIAL_TREE_FILLED,
  NATURAL_OR_AGRICULTURAL_SOILS,
] as const;

type FricheSoilTypeOption = (typeof options)[number];

const getFricheSoilTypeOptionLabel = (value: FricheSoilTypeOption) => {
  if (value === NATURAL_OR_AGRICULTURAL_SOILS)
    return "Espaces naturels ou agricoles (forêt, prairie, culture...)";
  return getLabelForFricheSoilType(value);
};

function FricheSoilsForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();

  const checkboxOptions = options.map((soilType) => ({
    label: getFricheSoilTypeOptionLabel(soilType),
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
      <h2>Quels types de sols y a-t-il sur cette friche ?</h2>
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

export default FricheSoilsForm;
