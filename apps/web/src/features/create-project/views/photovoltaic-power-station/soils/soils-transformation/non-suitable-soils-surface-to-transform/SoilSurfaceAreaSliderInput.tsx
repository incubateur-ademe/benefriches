import { FieldValues, UseControllerProps } from "react-hook-form";
import { SoilType } from "shared";

import { getColorForSoilType } from "@/shared/domain/soils";
import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import {
  getLabelForSoilType,
  getPictogramForSoilType,
} from "@/shared/services/label-mapping/soilTypeLabelMapping";
import SliderNumericInput from "@/shared/views/components/form/NumericInput/SliderNumericInput";

type Props<T extends FieldValues> = {
  soilType: SoilType;
  maxValue: number;
  marks: Record<number, string>;
} & Pick<UseControllerProps<T>, "control" | "name">;

export default function SoilSurfaceAreaSliderInput<T extends FieldValues>({
  soilType,
  maxValue,
  control,
  marks,
  name,
}: Props<T>) {
  return (
    <SliderNumericInput
      key={soilType}
      control={control}
      name={name}
      imgSrc={getPictogramForSoilType(soilType)}
      label={<span>{getLabelForSoilType(soilType)}</span>}
      maxValue={maxValue}
      sliderStartValue={0}
      sliderEndValue={maxValue}
      sliderProps={{
        marks,
        styles: {
          track: {
            background: getColorForSoilType(soilType),
          },
        },
        tooltip: {
          formatter: (value?: number) => value && formatSurfaceArea(value),
        },
      }}
      inputProps={{ step: "0.01" }}
    />
  );
}
