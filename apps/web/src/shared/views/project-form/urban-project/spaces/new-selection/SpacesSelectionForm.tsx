import { fr } from "@codegouvfr/react-dsfr";
import { Controller, useForm } from "react-hook-form";
import type { SoilType } from "shared";

import {
  getDescriptionForSpace,
  getLabelForSpace,
} from "@/features/create-project/core/urban-project/urbanProject";
import { getPictogramForSoilType } from "@/shared/core/label-mapping/soilTypeLabelMapping";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

export type FormValues = {
  soils: SoilType[];
};

type Props = {
  initialValues: SoilType[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  selectableSoils: SoilType[];
};

type SoilOptionsByCategory = { category: string; options: SoilType[] }[];

const ALL_OPTIONS: SoilOptionsByCategory = [
  {
    category: "Espaces minéraux",
    options: ["BUILDINGS", "IMPERMEABLE_SOILS", "MINERAL_SOIL"],
  },
  {
    category: "Espaces artificiels végétalisés",
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
    category: "Autre espace naturel",
    options: ["WET_LAND", "WATER"],
  },
];

const getSelectableOptionsByCategory = (
  allOptions: SoilOptionsByCategory,
  selectableSoils: SoilType[],
): SoilOptionsByCategory => {
  return allOptions
    .map(({ category, options }) => ({
      category,
      options: options.filter((soil) => selectableSoils.includes(soil)),
    }))
    .filter(({ options }) => options.length > 0);
};

type SoilTypeTileProps = {
  soilType: SoilType;
  isSelected: boolean;
  onChange: () => void;
};

const SoilTypeTile = ({ soilType, isSelected, onChange }: SoilTypeTileProps) => {
  const title = getLabelForSpace(soilType);
  const description = getDescriptionForSpace(soilType);
  const imgSrc = getPictogramForSoilType(soilType);

  return (
    <CheckableTile
      title={title}
      description={description}
      imgSrc={imgSrc}
      checked={isSelected}
      onChange={onChange}
      checkType="checkbox"
    />
  );
};

function SpacesSelectionForm({ initialValues, onSubmit, onBack, selectableSoils }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { soils: initialValues },
  });

  const validationError = formState.errors.soils;

  const optionsByCategory = getSelectableOptionsByCategory(ALL_OPTIONS, selectableSoils);

  return (
    <WizardFormLayout
      title="Quels types d'espaces y aura-t-il au sein du projet urbain&nbsp;?"
      instructions={
        <FormInfo>
          <h3>Pourquoi est-ce important de bien renseigner les espaces ?</h3>
          <p>
            Pour connaître la typologie des sols et donc la quantité de carbone que pourra stocker
            le site, et l'eau qu'il pourra absorber.
          </p>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {optionsByCategory.map(({ category, options }) => {
          return (
            <section key={category} className="mb-10">
              <h4>{category}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {options.map((option) => {
                  return (
                    <div key={option}>
                      <Controller
                        control={control}
                        name="soils"
                        rules={{ required: "Veuillez sélectionner au moins un type d'espace." }}
                        render={({ field }) => {
                          const isSelected = field.value.includes(option);
                          return (
                            <SoilTypeTile
                              soilType={option}
                              isSelected={isSelected}
                              onChange={() => {
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

export default SpacesSelectionForm;
