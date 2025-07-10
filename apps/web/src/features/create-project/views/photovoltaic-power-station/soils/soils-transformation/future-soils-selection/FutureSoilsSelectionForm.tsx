import { Controller, useForm } from "react-hook-form";
import { SoilsDistribution, SoilType, REQUIRED_SOILS_FOR_PHOTOVOLTAIC_PANELS } from "shared";

import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import {
  getLabelForSoilType,
  getPictogramForSoilType,
} from "@/shared/core/label-mapping/soilTypeLabelMapping";
import classNames from "@/shared/views/clsx";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import CheckableTile from "@/shared/views/components/CheckableTile/CheckableTile";
import FormDefinition from "@/shared/views/layout/WizardFormLayout/FormDefinition";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

export type FormValues = {
  soils: SoilType[];
};

type Props = {
  initialValues: FormValues;
  currentSoilsDistribution: SoilsDistribution;
  selectableSoils: SoilType[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type SoilTypeTileProps = {
  soilType: SoilType;
  surfaceArea: number;
  isSelected: boolean;
  onChange: () => void;
};

const soilTypeCategories = [
  {
    category: "Espaces minéraux",
    soils: ["BUILDINGS", "IMPERMEABLE_SOILS", "MINERAL_SOIL"],
  },
  {
    category: "Espaces végétalisés artificiels",
    soils: ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED", "ARTIFICIAL_TREE_FILLED"],
  },
  {
    category: "Prairies naturelles ou agricoles",
    soils: ["PRAIRIE_GRASS", "PRAIRIE_BUSHES", "PRAIRIE_TREES"],
  },
  {
    category: "Espaces agricoles",
    soils: ["CULTIVATION", "VINEYARD", "ORCHARD"],
  },
  {
    category: "Forêts",
    soils: ["FOREST_DECIDUOUS", "FOREST_CONIFER", "FOREST_POPLAR", "FOREST_MIXED"],
  },
  {
    category: "Autres espaces naturels",
    soils: ["WET_LAND", "WATER"],
  },
] as const;

const SoilTypeTile = ({ soilType, surfaceArea, isSelected, onChange }: SoilTypeTileProps) => {
  const title: string = getLabelForSoilType(soilType);
  const description = surfaceArea ? `${formatSurfaceArea(surfaceArea)} existant` : undefined;
  const imgSrc = getPictogramForSoilType(soilType);

  return (
    <CheckableTile
      title={title}
      description={description}
      imgSrc={imgSrc}
      checked={isSelected}
      onChange={onChange}
      disabled={REQUIRED_SOILS_FOR_PHOTOVOLTAIC_PANELS.includes(soilType)}
      checkType="checkbox"
    />
  );
};

function FutureSoilsSelectionForm({
  initialValues,
  selectableSoils,
  currentSoilsDistribution,
  onSubmit,
  onBack,
}: Props) {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const filteredCategories = soilTypeCategories
    .map((soilCategory) => {
      return {
        ...soilCategory,
        soils: soilCategory.soils.filter((soil) => selectableSoils.includes(soil)),
      };
    })
    .filter((soilCategory) => soilCategory.soils.length > 0);

  return (
    <WizardFormLayout
      title="Quels types de sols y aura-t-il sur ce site ?"
      instructions={
        <>
          <FormInfo>
            <p>
              Un minimum de sol imperméabilisé et de sol perméable minéral est requis pour les
              fondations des panneaux et les pistes d'accès.
            </p>
          </FormInfo>

          <FormDefinition>
            Le sol, quand il n'a pas été artificialisé, est un milieu vivant, dont la création en
            conditions naturelles (pédogénèse) prend plusieurs centaines d'années. C'est pourquoi la
            création de surfaces naturelles est illusoire sur le temps de vie du projet. Ainsi, il
            n'est possible d'ajouter que les surfaces végétalisées suivantes : enherbées, arbustives
            ou arborées.
          </FormDefinition>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {filteredCategories.map(({ category, soils }) => {
          return (
            <section key={category} className="tw-mb-10">
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
                {soils.map((soilType) => {
                  const surfaceArea = currentSoilsDistribution[soilType] ?? 0;
                  return (
                    <Controller
                      key={soilType}
                      control={control}
                      name="soils"
                      render={({ field }) => {
                        const isSelected = field.value.includes(soilType);
                        return (
                          <SoilTypeTile
                            soilType={soilType}
                            surfaceArea={surfaceArea}
                            isSelected={isSelected}
                            onChange={() => {
                              field.onChange(
                                isSelected
                                  ? field.value.filter((v) => v !== soilType)
                                  : [...field.value, soilType],
                              );
                            }}
                          />
                        );
                      }}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default FutureSoilsSelectionForm;
