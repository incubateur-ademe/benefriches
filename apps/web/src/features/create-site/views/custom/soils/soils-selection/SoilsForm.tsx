import { fr } from "@codegouvfr/react-dsfr";
import { Controller, useForm } from "react-hook-form";
import { SoilType } from "shared";

import {
  getDescriptionForSoilType,
  getLabelForSoilType,
  getPictogramForSoilType,
} from "@/shared/services/label-mapping/soilTypeLabelMapping";
import classNames from "@/shared/views/clsx";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

export type FormValues = {
  soils: SoilType[];
};

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  isFriche: boolean;
};

const siteSoilTypeTilesCategories: readonly { category: string; options: SoilType[] }[] = [
  {
    category: "Prairie naturelle ou agricole",
    options: ["PRAIRIE_GRASS", "PRAIRIE_BUSHES", "PRAIRIE_TREES"],
  },
  {
    category: "Espaces agricoles",
    options: ["CULTIVATION", "VINEYARD", "ORCHARD"],
  },
  {
    category: "Forêts",
    options: ["FOREST_DECIDUOUS", "FOREST_CONIFER", "FOREST_POPLAR", "FOREST_MIXED"],
  },
  {
    category: "Autres espaces naturels",
    options: ["WATER", "WET_LAND"],
  },
  {
    category: "Sols végétalisés végétalisés",
    options: ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED", "ARTIFICIAL_TREE_FILLED"],
  },
  {
    category: "Sols minéraux",
    options: ["BUILDINGS", "IMPERMEABLE_SOILS", "MINERAL_SOIL"],
  },
];

const fricheSoilTypeTilesCategories = [
  {
    category: "Sols minéraux",
    options: ["BUILDINGS", "IMPERMEABLE_SOILS", "MINERAL_SOIL"],
  },
  {
    category: "Sols végétalisés artificiels",
    options: ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED", "ARTIFICIAL_TREE_FILLED"],
  },
  {
    category: "Prairies naturelles ou agricoles",
    options: ["PRAIRIE_GRASS", "PRAIRIE_BUSHES", "PRAIRIE_TREES"],
  },
  {
    category: "Espaces agricoles",
    options: ["CULTIVATION", "VINEYARD", "ORCHARD"],
  },
  {
    category: "Forêts",
    options: ["FOREST_DECIDUOUS", "FOREST_CONIFER", "FOREST_POPLAR", "FOREST_MIXED"],
  },
  {
    category: "Autres espaces naturels",
    options: ["WET_LAND", "WATER"],
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
  const imgSrc = getPictogramForSoilType(soilType);

  return (
    <CheckableTile
      title={title}
      description={description}
      imgSrc={imgSrc}
      checked={isSelected}
      onChange={onSelect}
      checkType="checkbox"
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
        <FormInfo>
          <p>Plusieurs réponses possibles.</p>
          <p>
            Il est important de définir la répartition des sols pour connaître la quantité de
            carbone stocké par le site.
          </p>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {optionsCategories.map(({ category, options }) => {
          return (
            <section key={category} className={fr.cx("fr-mb-5w")}>
              <h4>{category}</h4>
              <div
                className={classNames(
                  "tw-grid",
                  "tw-grid-cols-1",
                  "sm:tw-grid-cols-2",
                  "lg:tw-grid-cols-3",
                  "tw-gap-4",
                )}
              >
                {options.map((option) => {
                  return (
                    <div key={option}>
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
        {validationError && (
          <p className={fr.cx("fr-error-text", "fr-mb-1-5v")}>{validationError.message}</p>
        )}
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default SiteSoilsForm;
