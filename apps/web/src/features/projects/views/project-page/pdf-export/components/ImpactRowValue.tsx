import { Text, View } from "@react-pdf/renderer";

import { ImpactFormatType } from "../../../shared/formatImpactValue";
import {
  formatCO2ImpactPdf,
  formatDefaultImpactPdf,
  formatETPImpactPdf,
  formatMonetaryImpactPdf,
  formatSurfaceAreaImpactPdf,
  formatTimeImpactPdf,
} from "../format";
import { concatClassNames, tw } from "../styles";

const getPositiveNegativeTextClassesFromValue = (value: number): string => {
  if (value === 0) {
    return "text-[#161616]";
  }
  // colors come from theme text-impacts-positive-main and text-impacts-negative-main
  // but they are not available in the rendered pdf for some reasons
  return value > 0 ? "text-[#18753C]" : "text-[#CE0500]";
};

const impactTypeFormatterMap = {
  co2: formatCO2ImpactPdf,
  monetary: formatMonetaryImpactPdf,
  surface_area: formatSurfaceAreaImpactPdf,
  etp: formatETPImpactPdf,
  time: formatTimeImpactPdf,
  default: formatDefaultImpactPdf,
} as const;

type Props = {
  label: string;
  value?: number;
  actor?: string;
  isTotal?: boolean;
  isMain?: boolean;
  valueType: ImpactFormatType | undefined;
};

export default function ImpactRowValue({
  label,
  value,
  actor,
  isTotal = false,
  isMain = false,
  valueType = "default",
}: Props) {
  const labelStyle = tw(
    concatClassNames(
      isTotal ? "font-bold" : "font-normal",
      isMain ? "text-xl" : "text-base",
      "w-[60%] mr-8",
    ),
  );
  const actorStyle = tw("w-[20%] mr-2");
  const valueStyle =
    value !== undefined
      ? tw(
          concatClassNames(
            "text-right",
            getPositiveNegativeTextClassesFromValue(value),
            isTotal ? "font-bold" : "font-normal",
            actor ? "w-[20%]" : "w-[40%]",
          ),
        )
      : {};

  return (
    <View style={tw("flex flex-row justify-between items-center py-1")}>
      <Text style={labelStyle}>{label}</Text>
      {actor && <Text style={actorStyle}>{actor}</Text>}
      {value !== undefined && (
        <Text style={valueStyle}>{impactTypeFormatterMap[valueType](value)}</Text>
      )}
    </View>
  );
}
