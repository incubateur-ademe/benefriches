import { useMemo } from "react";
import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { SoilType } from "../../../domain/siteFoncier.types";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";
import SliderNumericInput from "@/shared/views/components/form/NumericInput/SliderNumericInput";

type Props = {
  totalSurfaceArea: number;
  soils: SoilType[];
  onSubmit: (data: FormValues) => void;
};

export type FormValues = Record<SoilType, number>;

const getTotalSurface = (soilsSurfaceAreas: FormValues) =>
  Object.values(soilsSurfaceAreas)
    .filter(Number)
    .reduce((total, surface) => total + surface, 0);

const getInitialSurfacesFormSoilTypes = (soils: SoilType[]) =>
  soils.reduce(
    (soilSurfaceAreas, soilType) => ({ ...soilSurfaceAreas, [soilType]: 0 }),
    {},
  );

function SiteSoilsSurfaceAreasForm({
  soils,
  totalSurfaceArea,
  onSubmit,
}: Props) {
  const defaultValues = useMemo(
    () => getInitialSurfacesFormSoilTypes(soils),
    [soils],
  );
  const { control, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues,
  });
  const _onSubmit = handleSubmit(onSubmit);

  const soilsValues = watch();

  const totalAllocatedSurface = useMemo(
    () => getTotalSurface(soilsValues),
    [soilsValues],
  );

  const freeSurface = totalSurfaceArea - totalAllocatedSurface;

  return (
    <>
      <h2>Quelles sont les superficies des différents sols ?</h2>
      <p>La superficie du site est de {formatNumberFr(totalSurfaceArea)} m2.</p>
      <p>
        Les superficies des différents sols doivent totaliser{" "}
        {formatNumberFr(totalSurfaceArea)} m2.
      </p>
      <form onSubmit={_onSubmit}>
        {soils.map((soilType) => (
          <SliderNumericInput
            key={soilType}
            control={control}
            name={soilType}
            label={getLabelForSoilType(soilType)}
            hintText="en m2"
            maxAllowed={freeSurface + soilsValues[soilType]}
            sliderProps={{
              min: 0,
              max: totalSurfaceArea,
              tooltip: {
                formatter: (value?: number) =>
                  value && `${formatNumberFr(value)} m²`,
              },
            }}
          />
        ))}
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
        </div>

        <Input
          label="Total de toutes les superficies allouées"
          hintText="en m2"
          nativeInputProps={{
            value: totalAllocatedSurface,
            max: totalSurfaceArea,
            type: "number",
          }}
          disabled
          state={totalAllocatedSurface < totalSurfaceArea ? "error" : "default"}
          stateRelatedMessage={`- ${formatNumberFr(
            totalSurfaceArea - totalAllocatedSurface,
          )} m²`}
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default SiteSoilsSurfaceAreasForm;
