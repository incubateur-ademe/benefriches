import { Input } from "@codegouvfr/react-dsfr/Input";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  allocatedFlatSurface: number;
  minAdvisedFlatSurface: number;
};

function TotalFlatSurfacesInput({ allocatedFlatSurface, minAdvisedFlatSurface }: Props) {
  const hasMissingAllocatedFlatSurface = allocatedFlatSurface < minAdvisedFlatSurface;

  return (
    <Input
      label="Total des surfaces planes"
      nativeInputProps={{
        value: allocatedFlatSurface,
        type: "number",
        min: minAdvisedFlatSurface,
      }}
      disabled
      hintText={`Minimum conseillé : ${formatNumberFr(minAdvisedFlatSurface)} m²`}
      state={hasMissingAllocatedFlatSurface ? "error" : "default"}
      stateRelatedMessage={`La surface requise pour vos panneaux photovoltaïques est de ${formatNumberFr(
        minAdvisedFlatSurface,
      )} m²`}
    />
  );
}

export default TotalFlatSurfacesInput;
