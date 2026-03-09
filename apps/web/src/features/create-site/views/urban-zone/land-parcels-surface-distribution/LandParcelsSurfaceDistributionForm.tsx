import type { UrbanZoneLandParcelType } from "shared";

import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/core/format-number/formatNumber";
import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";

import { useSurfaceAreaInputMode } from "../../useSurfaceAreaInputMode";
import { PARCEL_TYPE_LABELS } from "../parcelTypeLabels";

export type FormValues = Partial<Record<UrbanZoneLandParcelType, number>>;

type Props = {
  selectedParcelTypes: UrbanZoneLandParcelType[];
  totalSurfaceArea: number;
  initialValues: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

function LandParcelsSurfaceDistributionForm({
  selectedParcelTypes,
  totalSurfaceArea,
  initialValues,
  onSubmit,
  onBack,
}: Props) {
  const { inputMode, onInputModeChange } = useSurfaceAreaInputMode();

  return (
    <SurfaceAreaDistributionForm
      title="Quelle superficie font les différentes parcelles ?"
      totalSurfaceArea={totalSurfaceArea}
      maxErrorMessage="La superficie ne peut pas être supérieure à la superficie totale du site"
      initialValues={initialValues}
      inputMode={inputMode}
      onInputModeChange={onInputModeChange}
      onSubmit={onSubmit}
      onBack={onBack}
      surfaces={selectedParcelTypes.map((type) => ({
        name: type,
        label: PARCEL_TYPE_LABELS[type],
        addonText: SQUARE_METERS_HTML_SYMBOL,
      }))}
    />
  );
}

export default LandParcelsSurfaceDistributionForm;
