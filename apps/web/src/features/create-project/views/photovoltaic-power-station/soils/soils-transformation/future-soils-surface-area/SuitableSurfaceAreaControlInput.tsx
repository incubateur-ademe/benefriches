import { Input } from "@codegouvfr/react-dsfr/Input";

import {
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/core/format-number/formatNumber";

type Props = {
  minSuitableSurfaceAreaToAllocate: number;
  allocatedSuitableSurfaceArea: number;
};

const successMessage = "Le compte est bon !";

function SuitableSurfaceAreaControlInput({
  minSuitableSurfaceAreaToAllocate,
  allocatedSuitableSurfaceArea,
}: Props) {
  const remainingSurfaceToAllocate =
    minSuitableSurfaceAreaToAllocate - allocatedSuitableSurfaceArea;
  const hasRemainingSurfaceToAllocate = remainingSurfaceToAllocate > 0;

  const errorMessage = `-${formatSurfaceArea(remainingSurfaceToAllocate)}`;
  return (
    <Input
      label="Total des sols compatibles"
      hintText={`en ${SQUARE_METERS_HTML_SYMBOL}`}
      nativeInputProps={{
        value: allocatedSuitableSurfaceArea,
      }}
      disabled
      state={hasRemainingSurfaceToAllocate ? "error" : "success"}
      stateRelatedMessage={hasRemainingSurfaceToAllocate ? errorMessage : successMessage}
    />
  );
}

export default SuitableSurfaceAreaControlInput;
