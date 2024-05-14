import { Input } from "@codegouvfr/react-dsfr/Input";

import {
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/services/format-number/formatNumber";

type Props = {
  minSuitableSurfaceAreaToAllocate: number;
  allocatedSuitableSurfaceArea: number;
};

const successMessage = "Vous avez alloué suffisament de surface compatible.";

function SuitableSurfaceAreaControlInput({
  minSuitableSurfaceAreaToAllocate,
  allocatedSuitableSurfaceArea,
}: Props) {
  const remainingSurfaceToAllocate =
    minSuitableSurfaceAreaToAllocate - allocatedSuitableSurfaceArea;
  const hasRemainingSurfaceToAllocate = remainingSurfaceToAllocate > 0;

  const errorMessage = `Il vous reste ${formatSurfaceArea(remainingSurfaceToAllocate)} de surface compatible à allouer.`;
  return (
    <Input
      label="Total des surfaces compatibles"
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
