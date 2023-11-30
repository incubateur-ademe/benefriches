import { Input } from "@codegouvfr/react-dsfr/Input";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  totalSurface: number;
  totalAllocatedSurface: number;
};

function TotalAllocatedSurfacesInput({
  totalSurface,
  totalAllocatedSurface,
}: Props) {
  const remainingSurfaceToAllocate = totalSurface - totalAllocatedSurface;
  const hasMissingAllocatedSurface = remainingSurfaceToAllocate > 0;

  return (
    <Input
      label="Total de toutes les surfaces allouées"
      hintText="en m²"
      nativeInputProps={{
        value: totalAllocatedSurface,
        max: totalSurface,
      }}
      disabled
      state={hasMissingAllocatedSurface ? "error" : "default"}
      stateRelatedMessage={`- ${formatNumberFr(remainingSurfaceToAllocate)} m²`}
    />
  );
}

export default TotalAllocatedSurfacesInput;
