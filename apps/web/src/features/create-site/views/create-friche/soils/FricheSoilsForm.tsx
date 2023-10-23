import { useForm, UseFormRegister } from "react-hook-form";
import { fr } from "@codegouvfr/react-dsfr";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { getLabelForFricheSoilType } from "../soilTypeLabelMapping";

import { FricheSoilType } from "@/features/create-site/domain/friche.types";

export type FormValues = {
  soils: FricheSoilType[];
};

type Props = {
  onSubmit: (data: FormValues) => void;
};

const mapSoilOptions =
  (register: UseFormRegister<FormValues>) => (soilType: FricheSoilType) => {
    return {
      label: getLabelForFricheSoilType(soilType),
      nativeInputProps: {
        ...register("soils", {
          required:
            "Ce champ est nécessaire pour déterminer les questions suivantes",
        }),
        value: soilType,
      },
    };
  };

function FricheSoilsForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();

  const validationError = formState.errors.soils;

  return (
    <>
      <h2>Quels types de sols y a-t-il sur cette friche ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={fr.cx("fr-accordions-group", "fr-pb-3w")}>
          <Accordion label="Sols artificialisés" defaultExpanded>
            <Checkbox
              options={[
                FricheSoilType.BUILDINGS,
                FricheSoilType.IMPERMEABLE_SOILS,
                FricheSoilType.MINERAL_SOIL,
                FricheSoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
                FricheSoilType.ARTIFICIAL_TREE_FILLED,
              ].map(mapSoilOptions(register))}
              state={validationError ? "error" : "default"}
              stateRelatedMessage={
                validationError ? validationError.message : undefined
              }
            />
          </Accordion>
          <Accordion label="Espaces agricoles en friche">
            <Checkbox
              options={[
                FricheSoilType.CULTIVATION,
                FricheSoilType.VINEYARD,
                FricheSoilType.ORCHARD,
                FricheSoilType.PRAIRIE_BUSHES,
                FricheSoilType.PRAIRIE_GRASS,
                FricheSoilType.PRAIRIE_TREES,
              ].map(mapSoilOptions(register))}
              state={validationError ? "error" : "default"}
              stateRelatedMessage={
                validationError ? validationError.message : undefined
              }
            />
          </Accordion>
          <Accordion label="Autres espaces">
            <Checkbox
              options={[
                FricheSoilType.FOREST_DECIDUOUS,
                FricheSoilType.FOREST_CONIFER,
                FricheSoilType.FOREST_POPLAR,
                FricheSoilType.FOREST_MIXED,
                FricheSoilType.WET_LAND,
                FricheSoilType.WATER,
              ].map(mapSoilOptions(register))}
              state={validationError ? "error" : "default"}
              stateRelatedMessage={
                validationError ? validationError.message : undefined
              }
            />
          </Accordion>
        </div>
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
