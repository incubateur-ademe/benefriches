import type { UrbanZoneLandParcelType } from "shared";

import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";

import { useSurfaceAreaInputMode } from "../../useSurfaceAreaInputMode";
import {
  getColorForLandParcelType,
  getPictogramForUrbanZoneLandParcelType,
  PARCEL_TYPE_DESCRIPTIONS,
  PARCEL_TYPE_LABELS,
} from "../landParcelTypeMetadata";

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
      title="Quelle superficie occupe chaque  surface foncière ?"
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
        hintText: PARCEL_TYPE_DESCRIPTIONS[type],
        imgSrc: getPictogramForUrbanZoneLandParcelType(type),
        color: getColorForLandParcelType(type),
      }))}
    />
  );
}

export default LandParcelsSurfaceDistributionForm;
