import { fr } from "@codegouvfr/react-dsfr";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Controller, useForm } from "react-hook-form";
import { SiteNature, SoilType } from "shared";

import {
  getPictogramForSoilType,
  getSpaceDescriptionForSoilTypeAndSiteNature,
  getSpaceLabelForSoilTypeAndSiteNature,
} from "@/shared/core/label-mapping/soilTypeLabelMapping";
import classNames from "@/shared/views/clsx";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

export type FormValues = {
  soils: SoilType[];
};

type Props = {
  initialValues: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  siteNature?: SiteNature;
};

type SoilOptionsByCategory = { category: string; options: SoilType[]; defaultOpen: boolean }[];

const FRICHE_OPTIONS = [
  {
    category: "Espaces minéraux",
    options: ["BUILDINGS", "IMPERMEABLE_SOILS", "MINERAL_SOIL"],
    defaultOpen: true,
  },
  {
    category: "Espaces végétalisés artificiels",
    options: ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED", "ARTIFICIAL_TREE_FILLED"],
    defaultOpen: true,
  },
  {
    category: "Prairies naturelles ou agricoles",
    options: ["PRAIRIE_GRASS", "PRAIRIE_BUSHES", "PRAIRIE_TREES"],
    defaultOpen: false,
  },
  {
    category: "Espaces agricoles",
    options: ["CULTIVATION", "VINEYARD", "ORCHARD"],
    defaultOpen: false,
  },
  {
    category: "Forêt",
    options: ["FOREST_DECIDUOUS", "FOREST_CONIFER", "FOREST_POPLAR", "FOREST_MIXED"],
    defaultOpen: false,
  },
  {
    category: "Autre espace naturel",
    options: ["WET_LAND", "WATER"],
    defaultOpen: false,
  },
] as const satisfies SoilOptionsByCategory;

const AGRICULTURAL_OPERATION_OPTIONS = [
  {
    category: "Espaces agricoles",
    options: ["CULTIVATION", "VINEYARD", "ORCHARD"],
    defaultOpen: true,
  },
  {
    category: "Prairie naturelle ou agricole",
    options: ["PRAIRIE_GRASS", "PRAIRIE_BUSHES", "PRAIRIE_TREES"],
    defaultOpen: true,
  },
  {
    category: "Forêt",
    options: ["FOREST_DECIDUOUS", "FOREST_CONIFER", "FOREST_POPLAR", "FOREST_MIXED"],
    defaultOpen: false,
  },
  {
    category: "Autre espace naturel",
    options: ["WATER", "WET_LAND"],
    defaultOpen: false,
  },
  {
    category: "Espaces minéraux",
    options: ["BUILDINGS", "IMPERMEABLE_SOILS", "MINERAL_SOIL"],
    defaultOpen: false,
  },
  {
    category: "Espaces végétalisés artificiels",
    options: ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED", "ARTIFICIAL_TREE_FILLED"],
    defaultOpen: false,
  },
] as const satisfies SoilOptionsByCategory;

const NATURAL_AREA_OPTIONS = [
  {
    category: "Forêt",
    options: ["FOREST_DECIDUOUS", "FOREST_CONIFER", "FOREST_POPLAR", "FOREST_MIXED"],
    defaultOpen: true,
  },
  {
    category: "Prairie naturelle ou agricole",
    options: ["PRAIRIE_GRASS", "PRAIRIE_BUSHES", "PRAIRIE_TREES"],
    defaultOpen: true,
  },
  {
    category: "Autre espace naturel",
    options: ["WATER", "WET_LAND"],
    defaultOpen: true,
  },
  {
    category: "Espaces minéraux",
    options: ["BUILDINGS", "IMPERMEABLE_SOILS", "MINERAL_SOIL"],
    defaultOpen: false,
  },
  {
    category: "Espaces végétalisés artificiels",
    options: ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED", "ARTIFICIAL_TREE_FILLED"],
    defaultOpen: false,
  },
  {
    category: "Espaces agricoles",
    options: ["CULTIVATION", "VINEYARD", "ORCHARD"],
    defaultOpen: false,
  },
] as const satisfies SoilOptionsByCategory;

const getOptionsForSiteNature = (siteNature: SiteNature): SoilOptionsByCategory => {
  switch (siteNature) {
    case "FRICHE":
      return FRICHE_OPTIONS;
    case "AGRICULTURAL_OPERATION":
      return AGRICULTURAL_OPERATION_OPTIONS;
    case "NATURAL_AREA":
      return NATURAL_AREA_OPTIONS;
  }
};

type SoilTypeTileProps = {
  soilType: SoilType;
  siteNature: SiteNature;
  isSelected: boolean;
  onSelect: () => void;
};

const SoilTypeTile = ({ soilType, isSelected, siteNature, onSelect }: SoilTypeTileProps) => {
  const title: string = getSpaceLabelForSoilTypeAndSiteNature(soilType, siteNature);
  const description: string | undefined = getSpaceDescriptionForSoilTypeAndSiteNature(
    soilType,
    siteNature,
  );
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

const getTitle = (siteNature: SiteNature | undefined) => {
  const baseTitle = `Quels types d'espaces y a-t-il sur`;
  switch (siteNature) {
    case "FRICHE":
      return `${baseTitle} la friche ?`;
    case "AGRICULTURAL_OPERATION":
      return `${baseTitle} l'exploitation ?`;
    case "NATURAL_AREA":
      return `${baseTitle} l'espace naturel ?`;
    default:
      return `${baseTitle} le site ?`;
  }
};

function SiteSpacesSelectionForm({ initialValues, onSubmit, onBack, siteNature }: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const validationError = formState.errors.soils;

  const optionsByCategory = getOptionsForSiteNature(siteNature!);

  return (
    <WizardFormLayout
      title={getTitle(siteNature)}
      instructions={
        <FormInfo>
          <p>Plusieurs réponses possibles.</p>
          <p>
            Il est important de définir les espaces présents sur le site pour connaître la typologie
            des sols et ainsi la quantité de carbone stocké par le site.
          </p>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {optionsByCategory.map(({ category, options, defaultOpen }) => {
          return (
            <section key={category} className="mb-10">
              <Accordion label={category} titleAs="h4" defaultExpanded={defaultOpen}>
                <div
                  className={classNames(
                    "grid",
                    "grid-cols-1",
                    "sm:grid-cols-2",
                    "lg:grid-cols-3",
                    "gap-4",
                  )}
                >
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
                                siteNature={siteNature!}
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
              </Accordion>
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

export default SiteSpacesSelectionForm;
