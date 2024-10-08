import { Input } from "@codegouvfr/react-dsfr/Input";

import {
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/services/format-number/formatNumber";

type Props = {
  availableSurfaceArea: number;
  allocatedSurfaceArea: number;
};

function AllocatedSurfaceAreaControlInput({ availableSurfaceArea, allocatedSurfaceArea }: Props) {
  const remainingSurfaceToAllocate = availableSurfaceArea - allocatedSurfaceArea;
  const hasRemainingSurfaceToAllocate = remainingSurfaceToAllocate > 0;

  const hasError = allocatedSurfaceArea !== availableSurfaceArea;
  const errorMessage =
    hasError && hasRemainingSurfaceToAllocate
      ? `${formatSurfaceArea(remainingSurfaceToAllocate)} manquants`
      : `${formatSurfaceArea(-remainingSurfaceToAllocate)} en trop`;
  const successMessage = "Le compte est bon !";

  return (
    <Input
      label="Total de toutes les surfaces"
      hintText={`en ${SQUARE_METERS_HTML_SYMBOL}`}
      nativeInputProps={{
        value: allocatedSurfaceArea,
      }}
      disabled
      state={hasError ? "error" : "success"}
      stateRelatedMessage={hasError ? errorMessage : successMessage}
    />
  );
}

export default AllocatedSurfaceAreaControlInput;
