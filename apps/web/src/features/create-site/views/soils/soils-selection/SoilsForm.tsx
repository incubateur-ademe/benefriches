import { useForm, UseFormRegister } from "react-hook-form";
import { fr } from "@codegouvfr/react-dsfr";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { SoilType } from "../../../domain/siteFoncier.types";

import { getLongLabelForSoilType } from "@/shared/views/helpers/soilTypeLabelMapping";

export type FormValues = {
  soils: SoilType[];
};

type Props = {
  onSubmit: (data: FormValues) => void;
  isFriche: boolean;
};

const mapSoilOptions =
  (register: UseFormRegister<FormValues>) => (soilType: SoilType) => {
    return {
      label: getLongLabelForSoilType(soilType),
      nativeInputProps: {
        ...register("soils", {
          required:
            "Ce champ est nécessaire pour déterminer les questions suivantes",
        }),
        value: soilType,
      },
    };
  };

const siteSoilOptionsCategories = [
  {
    category: "Espaces agricoles",
    options: [SoilType.CULTIVATION, SoilType.VINEYARD, SoilType.ORCHARD],
  },
  {
    category: "Prairies",
    options: [
      SoilType.PRAIRIE_BUSHES,
      SoilType.PRAIRIE_GRASS,
      SoilType.PRAIRIE_TREES,
    ],
  },
  {
    category: "Forêts",
    options: [
      SoilType.FOREST_DECIDUOUS,
      SoilType.FOREST_CONIFER,
      SoilType.FOREST_POPLAR,
      SoilType.FOREST_MIXED,
    ],
  },
  {
    category: "Autres espaces naturels",
    options: [SoilType.WATER, SoilType.WET_LAND],
  },
  {
    category: "Sols artificialisés",
    options: [
      SoilType.BUILDINGS,
      SoilType.IMPERMEABLE_SOILS,
      SoilType.MINERAL_SOIL,
      SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
      SoilType.ARTIFICIAL_TREE_FILLED,
    ],
  },
] as const;

const fricheSoilOptionsCategories = [
  {
    category: "Sols artificialisés",
    options: [
      SoilType.BUILDINGS,
      SoilType.IMPERMEABLE_SOILS,
      SoilType.MINERAL_SOIL,
      SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
      SoilType.ARTIFICIAL_TREE_FILLED,
    ],
  },
  {
    category: "Espaces agricoles en friche",
    options: [
      SoilType.CULTIVATION,
      SoilType.VINEYARD,
      SoilType.ORCHARD,
      SoilType.PRAIRIE_BUSHES,
      SoilType.PRAIRIE_GRASS,
      SoilType.PRAIRIE_TREES,
    ],
  },
  {
    category: "Autres espaces",
    options: [
      SoilType.FOREST_DECIDUOUS,
      SoilType.FOREST_CONIFER,
      SoilType.FOREST_POPLAR,
      SoilType.FOREST_MIXED,
      SoilType.WET_LAND,
      SoilType.WATER,
    ],
  },
] as const;

function SiteSoilsForm({ onSubmit, isFriche }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();

  const validationError = formState.errors.soils;

  const optionsCategories = isFriche
    ? fricheSoilOptionsCategories
    : siteSoilOptionsCategories;

  return (
    <>
      <h2>
        Quels types de sols y a-t-il sur {isFriche ? "cette friche" : "ce site"}{" "}
        ?
      </h2>
      <p>Plusieurs réponses possibles.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={fr.cx("fr-accordions-group", "fr-pb-3w")}>
          {optionsCategories.map(({ category, options }, index) => {
            return (
              <Accordion
                label={category}
                key={category}
                defaultExpanded={index === 0}
              >
                <Checkbox
                  options={options.map(mapSoilOptions(register))}
                  state={validationError ? "error" : "default"}
                  stateRelatedMessage={
                    validationError ? validationError.message : undefined
                  }
                />
              </Accordion>
            );
          })}
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

export default SiteSoilsForm;
