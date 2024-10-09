import {
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/services/format-number/formatNumber";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";

type Props = {
  label: string;
  targetSurfaceArea: number;
  currentSurfaceArea: number;
};

function SurfaceAreaControlInput({ label, targetSurfaceArea, currentSurfaceArea }: Props) {
  const remainder = targetSurfaceArea - currentSurfaceArea;
  const isValid = remainder === 0;

  return (
    <RowNumericInput
      className="tw-pb-5"
      label={label}
      hintText={`en ${SQUARE_METERS_HTML_SYMBOL}`}
      nativeInputProps={{
        value: currentSurfaceArea,
        min: 0,
        max: targetSurfaceArea,
        type: "number",
      }}
      disabled
      state={isValid ? "success" : "error"}
      stateRelatedMessage={
        isValid
          ? "Le compte est bon !"
          : `${formatSurfaceArea(Math.abs(remainder))} ${remainder > 0 ? "manquants" : "en trop"}`
      }
    />
  );
}

export default SurfaceAreaControlInput;
