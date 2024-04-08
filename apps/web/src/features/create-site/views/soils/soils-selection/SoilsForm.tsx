import { Controller, useForm } from "react-hook-form";
import { fr } from "@codegouvfr/react-dsfr";

import { SoilType } from "@/shared/domain/soils";
import {
  getDescriptionForSoilType,
  getLabelForSoilType,
  getPictogramForSoilType,
} from "@/shared/services/label-mapping/soilTypeLabelMapping";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

export type FormValues = {
  soils: SoilType[];
};

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  isFriche: boolean;
};

const siteSoilTypeTilesCategories = [
  {
    category: "Prairie naturelle ou agricole",
    options: [SoilType.PRAIRIE_GRASS, SoilType.PRAIRIE_BUSHES, SoilType.PRAIRIE_TREES],
  },
  {
    category: "Espaces agricoles",
    options: [SoilType.CULTIVATION, SoilType.VINEYARD, SoilType.ORCHARD],
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
    category: "Sols artificiels végétalisés",
    options: [SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED, SoilType.ARTIFICIAL_TREE_FILLED],
  },
  {
    category: "Sols artificiels minéraux",
    options: [SoilType.BUILDINGS, SoilType.IMPERMEABLE_SOILS, SoilType.MINERAL_SOIL],
  },
] as const;

const fricheSoilTypeTilesCategories = [
  {
    category: "Sols artificiels minéraux",
    options: [SoilType.BUILDINGS, SoilType.IMPERMEABLE_SOILS, SoilType.MINERAL_SOIL],
  },
  {
    category: "Sols artificiels végétalisés",
    options: [SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED, SoilType.ARTIFICIAL_TREE_FILLED],
  },
  {
    category: "Prairies naturelles ou agricoles",
    options: [SoilType.PRAIRIE_GRASS, SoilType.PRAIRIE_BUSHES, SoilType.PRAIRIE_TREES],
  },
  {
    category: "Espaces agricoles",
    options: [SoilType.CULTIVATION, SoilType.VINEYARD, SoilType.ORCHARD],
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
    options: [SoilType.WET_LAND, SoilType.WATER],
  },
] as const;

type SoilTypeTileProps = {
  soilType: SoilType;
  isSelected: boolean;
  onSelect: () => void;
};

const SoilTypeTile = ({ soilType, isSelected, onSelect }: SoilTypeTileProps) => {
  const title: string = getLabelForSoilType(soilType);
  const description: string | undefined = getDescriptionForSoilType(soilType);
  const imgSrc = `/img/pictograms/soil-types/${getPictogramForSoilType(soilType)}`;

  return (
    <CheckableTile
      title={title}
      description={description}
      imgSrc={imgSrc}
      isSelected={isSelected}
      onSelect={onSelect}
    />
  );
};

function SiteSoilsForm({ onSubmit, onBack, isFriche }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      soils: [],
    },
  });

  const validationError = formState.errors.soils;

  const optionsCategories = isFriche ? fricheSoilTypeTilesCategories : siteSoilTypeTilesCategories;

  return (
    <WizardFormLayout
      title={`Quels types de sols y a-t-il sur ${isFriche ? "cette friche" : "ce site"} ?`}
      instructions={
        <>
          <p>Plusieurs réponses possibles.</p>
          <p>
            Il est important de définir la typologie des sols pour connaître la quantité de carbone
            stocké par le site.
          </p>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {optionsCategories.map(({ category, options }) => {
          return (
            <section key={category} className={fr.cx("fr-mb-5w")}>
              <h4>{category}</h4>
              <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
                {options.map((option) => {
                  return (
                    <div className={fr.cx("fr-col-4")} key={option}>
                      <Controller
                        control={control}
                        name="soils"
                        rules={{ required: "Veuillez sélectionner au moins un type de sol." }}
                        render={({ field }) => {
                          const isSelected = field.value.includes(option);
                          return (
                            <SoilTypeTile
                              soilType={option}
                              isSelected={isSelected}
                              onSelect={() => {
                                field.onChange(
                                  isSelected
                                    ? field.value.filter((v) => v !== option)
                                    : [...field.value, option],
                                );
                              }}
                            />
                          );
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
        {validationError && <p className={fr.cx("fr-error-text")}>{validationError.message}</p>}
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default SiteSoilsForm;
