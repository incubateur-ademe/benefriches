import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";

import {
  SiteFoncier,
  SoilType,
} from "@/features/create-site/domain/siteFoncier.types";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import SliderNumericInput from "@/shared/views/components/form/NumericInput/SliderNumericInput";
import { getLabelForSoilType } from "@/shared/views/helpers/soilTypeLabelMapping";

type Props = {
  onSubmit: (data: FormValues) => void;
  siteSoils: SiteFoncier["soilsSurfaceAreas"];
  totalSurfaceArea: number;
  minAdvisedFlatSurfaces: number;
  minAdvisedSoilSurfacesByType: Partial<Record<SoilType, number>>;
};
type SoilsSurfaceAreasAsArray = { soilType: SoilType; surface: number }[];
type FormValues = {
  soilsSurfaceAreas: SoilsSurfaceAreasAsArray;
};

const NON_FLAT_SOIL_TYPES = [
  SoilType.BUILDINGS,
  SoilType.FOREST_CONIFER,
  SoilType.FOREST_DECIDUOUS,
  SoilType.FOREST_MIXED,
  SoilType.FOREST_POPLAR,
  SoilType.PRAIRIE_TREES,
  SoilType.ARTIFICIAL_TREE_FILLED,
];

const computeDefaultValues = (
  siteSoils: Props["siteSoils"],
  minAdvisedSoilSurfacesByType: Props["minAdvisedSoilSurfacesByType"],
) => {
  const siteSoilsAsArray = Object.entries(siteSoils).map(
    ([soilType, surface]) => ({ soilType, surface }),
  );
  if (
    minAdvisedSoilSurfacesByType[SoilType.IMPERMEABLE_SOILS] &&
    !siteSoils[SoilType.IMPERMEABLE_SOILS]
  ) {
    siteSoilsAsArray.push({ soilType: SoilType.IMPERMEABLE_SOILS, surface: 0 });
  }
  if (
    minAdvisedSoilSurfacesByType[SoilType.MINERAL_SOIL] &&
    !siteSoils[SoilType.MINERAL_SOIL]
  ) {
    siteSoilsAsArray.push({ soilType: SoilType.MINERAL_SOIL, surface: 0 });
  }
  return siteSoilsAsArray as SoilsSurfaceAreasAsArray;
};

const getMarks = (currentSurface?: number, minAdvisedValue?: number) => {
  const marks = [];

  if (minAdvisedValue) {
    marks.push([minAdvisedValue, `${formatNumberFr(minAdvisedValue)} m²`]);
  }
  if (currentSurface) {
    marks.push([currentSurface, `${formatNumberFr(currentSurface)} m²`]);
  }

  return Object.fromEntries(marks) as Record<number, string>;
};

const getHintText = (currentSurface?: number, minAdvisedValue?: number) => {
  const hintText = `Surface sur le site : ${formatNumberFr(
    currentSurface ?? 0,
  )} m²`;

  if (minAdvisedValue) {
    return `${hintText} - Minimum conseillé : ${formatNumberFr(
      minAdvisedValue,
    )} m²`;
  }

  return hintText;
};

function SoilsSurfaceDistributionForm({
  onSubmit,
  totalSurfaceArea,
  siteSoils,
  minAdvisedFlatSurfaces,
  minAdvisedSoilSurfacesByType,
}: Props) {
  const defaultSoilsSurfaceAreas = computeDefaultValues(
    siteSoils,
    minAdvisedSoilSurfacesByType,
  );

  const defaultValues = {
    soilsSurfaceAreas: defaultSoilsSurfaceAreas,
  };

  const { control, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues,
  });
  const { fields } = useFieldArray({
    control,
    name: "soilsSurfaceAreas",
  });

  const watchSoils = watch("soilsSurfaceAreas");
  const controlledSoilsFields = fields.map((field, index) => ({
    ...field,
    ...watchSoils[index],
  }));

  const totalAllowedSurface = useMemo(
    () =>
      controlledSoilsFields.reduce((total, { surface }) => total + surface, 0),
    [controlledSoilsFields],
  );

  const remainingSurface = totalSurfaceArea - totalAllowedSurface;

  const totalFlatSurface = useMemo(
    () =>
      controlledSoilsFields
        .filter(({ soilType }) => !NON_FLAT_SOIL_TYPES.includes(soilType))
        .reduce((total, { surface }) => total + surface, 0),
    [controlledSoilsFields],
  );

  return (
    <>
      <h2>Quelle sera la future répartition des sols ?</h2>
      <p>
        La superficie du site est de {formatNumberFr(totalSurfaceArea)} m2. Les
        superficies des différents sols doivent totaliser{" "}
        {formatNumberFr(totalSurfaceArea)} m2.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {controlledSoilsFields.map(({ soilType, surface, id }, index) => (
          <SliderNumericInput
            key={id}
            name={`soilsSurfaceAreas.${index}.surface`}
            label={getLabelForSoilType(soilType)}
            hintText={getHintText(
              siteSoils[soilType],
              minAdvisedSoilSurfacesByType[soilType],
            )}
            maxAvailable={remainingSurface + surface}
            control={control}
            inputNativeProps={{
              step: 100,
            }}
            sliderProps={{
              min: 0,
              max: totalSurfaceArea,
              marks: getMarks(
                siteSoils[soilType],
                minAdvisedSoilSurfacesByType[soilType],
              ),
              tooltip: {
                formatter: (value?: number) =>
                  value && `${formatNumberFr(value)} m²`,
              },
            }}
          />
        ))}

        <div className="fr-py-7v">
          <Button
            onClick={() => reset(defaultValues)}
            priority="secondary"
            nativeButtonProps={{ type: "button" }}
          >
            Réinitialiser les valeurs
          </Button>
        </div>

        <Input
          label="Total des surfaces planes"
          nativeInputProps={{
            value: totalFlatSurface,
            type: "number",
            min: minAdvisedFlatSurfaces,
          }}
          disabled
          hintText={`Minimum conseillé : ${formatNumberFr(
            minAdvisedFlatSurfaces,
          )} m²`}
          state={
            totalFlatSurface < minAdvisedFlatSurfaces ? "error" : "default"
          }
          stateRelatedMessage={`La surface requise pour vos panneaux photovoltaïques est de ${formatNumberFr(
            minAdvisedFlatSurfaces,
          )} m²`}
        />
        <Input
          label="Total de toutes les surfaces allouées"
          hintText="en m²"
          nativeInputProps={{
            value: totalAllowedSurface,
            max: totalSurfaceArea,
          }}
          disabled
          state={totalAllowedSurface < totalSurfaceArea ? "error" : "default"}
          stateRelatedMessage={`- ${formatNumberFr(
            totalSurfaceArea - totalAllowedSurface,
          )} m²`}
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default SoilsSurfaceDistributionForm;
