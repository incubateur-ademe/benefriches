import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { FLAT_SOIL_TYPES, SOIL_TYPES } from "../../domain/soils.types";
import SoilsSurfaceAreasAddButton from "./SoilsSurfaceAreasAddButton";

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

type SoilsSurfaceAreas = { soilType: SoilType; surface: number };
type FormValues = {
  soilsSurfaceAreas: SoilsSurfaceAreas[];
};

const computeDefaultValues = (
  siteSoils: Props["siteSoils"],
  minAdvisedSoilSurfacesByType: Props["minAdvisedSoilSurfacesByType"],
) => {
  const siteSoilsAsArray = Object.entries(siteSoils).map(
    ([soilType, surface]) => ({ soilType, surface }),
  );

  [SoilType.IMPERMEABLE_SOILS, SoilType.MINERAL_SOIL].forEach((soilType) => {
    if (minAdvisedSoilSurfacesByType[soilType] && !siteSoils[soilType]) {
      siteSoilsAsArray.unshift({ soilType: soilType, surface: 0 });
    }
  });

  return siteSoilsAsArray as SoilsSurfaceAreas[];
};

const getHintTextAndMarks = ({
  existingSurface,
  minAdvisedSurface,
}: {
  existingSurface?: number;
  minAdvisedSurface?: number;
}) => {
  const marks = [];

  const hintSurfaceText = `Actuellement : ${formatNumberFr(
    existingSurface ?? 0,
  )} m²`;
  let hintAdvisedSurfaceText = "";

  if (minAdvisedSurface) {
    hintAdvisedSurfaceText = ` - Minimum conseillé : ${formatNumberFr(
      minAdvisedSurface,
    )} m²`;
    marks.push([minAdvisedSurface, `${formatNumberFr(minAdvisedSurface)} m²`]);
  }

  if (existingSurface) {
    marks.push([existingSurface, `${formatNumberFr(existingSurface)} m²`]);
  }

  return {
    hintText: `${hintSurfaceText}${hintAdvisedSurfaceText}`,
    marks: Object.fromEntries(marks) as Record<number, string>,
  };
};

const getTotalSurface = (soilsSurfaceAreas: SoilsSurfaceAreas[]) =>
  soilsSurfaceAreas.reduce((total, { surface }) => total + surface, 0);
const getTotalFlatSurface = (soilsSurfaceAreas: SoilsSurfaceAreas[]) =>
  getTotalSurface(
    soilsSurfaceAreas.filter(({ soilType }) =>
      FLAT_SOIL_TYPES.includes(soilType),
    ),
  );
const getAvailableSoilTypes = (soilsSurfaceAreas: SoilsSurfaceAreas[]) => {
  const selectedSoilTypes = soilsSurfaceAreas.map(({ soilType }) => soilType);
  return SOIL_TYPES.filter((soilType) => !selectedSoilTypes.includes(soilType));
};

function SoilsSurfaceAreasForm({
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

  const { fields, append } = useFieldArray({
    control,
    name: "soilsSurfaceAreas",
  });

  const watchSoils = watch("soilsSurfaceAreas");

  // Controlled Field Array: https://react-hook-form.com/docs/usefieldarray
  const controlledSoilsFields = fields.map((field, index) => ({
    ...field,
    ...watchSoils[index],
  }));

  const totalAllowedSurface = useMemo(
    () => getTotalSurface(controlledSoilsFields),
    [controlledSoilsFields],
  );
  const remainingSurface = totalSurfaceArea - totalAllowedSurface;
  const totalFlatSurface = useMemo(
    () => getTotalFlatSurface(controlledSoilsFields),
    [controlledSoilsFields],
  );
  const availableSoilTypes = useMemo(
    () => getAvailableSoilTypes(controlledSoilsFields),
    [controlledSoilsFields],
  );

  return (
    <>
      <h2>Quelle sera la future répartition des sols ?</h2>
      {minAdvisedSoilSurfacesByType[SoilType.IMPERMEABLE_SOILS] && (
        <p>
          Les <strong>sols imperméables</strong> devraient faire au minimum{" "}
          {formatNumberFr(
            minAdvisedSoilSurfacesByType[SoilType.IMPERMEABLE_SOILS],
          )}{" "}
          m2. C’est la superficie qu’occuperont{" "}
          <strong>les fondations des panneaux</strong>.
        </p>
      )}

      {minAdvisedSoilSurfacesByType[SoilType.MINERAL_SOIL] && (
        <p>
          Les <strong>sols minéraux</strong> devraient faire au minimum{" "}
          {formatNumberFr(minAdvisedSoilSurfacesByType[SoilType.MINERAL_SOIL])}{" "}
          m2. C’est la superficie requise <strong>les pistes d’accès</strong>.
        </p>
      )}

      <p>
        Les <strong>surfaces planes</strong> (c’est-à-dire tous les sols hors{" "}
        <strong>bâtiments, forêts, prairie arborée et sols arboré</strong>)
        devraient totaliser au minimum {formatNumberFr(minAdvisedFlatSurfaces)}{" "}
        m2. C’est la superficie requise pour vos panneaux photovoltaïques.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {controlledSoilsFields.map(({ soilType, surface, id }, index) => {
          const { hintText, marks } = getHintTextAndMarks({
            existingSurface: siteSoils[soilType],
            minAdvisedSurface: minAdvisedSoilSurfacesByType[soilType],
          });
          return (
            <SliderNumericInput
              key={id}
              control={control}
              name={`soilsSurfaceAreas.${index}.surface`}
              label={getLabelForSoilType(soilType)}
              maxAllowed={remainingSurface + surface}
              hintText={hintText}
              inputProps={{
                step: 100,
              }}
              sliderProps={{
                min: 0,
                marks,
                max: totalSurfaceArea,
                tooltip: {
                  formatter: (value?: number) =>
                    value && `${formatNumberFr(value)} m²`,
                },
              }}
            />
          );
        })}

        <div
          className="fr-py-7v"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button
            onClick={() => reset(defaultValues)}
            priority="secondary"
            nativeButtonProps={{ type: "button" }}
          >
            Réinitialiser les valeurs
          </Button>

          <SoilsSurfaceAreasAddButton
            onValidate={(data: SoilsSurfaceAreas) => append(data)}
            soilTypes={availableSoilTypes}
          />
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

export default SoilsSurfaceAreasForm;
