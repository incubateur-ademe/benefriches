import type { SoilType, SoilsDistribution, UrbanZoneLandParcelType } from "shared";

import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/core/format-number/formatNumber";
import {
  getDescriptionForSoilType,
  getLabelForSoilType,
  getPictogramForSoilType,
} from "@/shared/core/label-mapping/soilTypeLabelMapping";
import { getColorForSoilType } from "@/shared/core/soils";
import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";

import { useSurfaceAreaInputMode } from "../../useSurfaceAreaInputMode";
import { PARCEL_TYPE_LABELS } from "../parcelTypeLabels";

export type FormValues = SoilsDistribution;

const URBAN_ZONE_SOIL_TYPES: SoilType[] = [
  "BUILDINGS",
  "IMPERMEABLE_SOILS",
  "MINERAL_SOIL",
  "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
  "ARTIFICIAL_TREE_FILLED",
  "PRAIRIE_GRASS",
  "PRAIRIE_BUSHES",
  "PRAIRIE_TREES",
];

type Props = {
  currentParcelType: UrbanZoneLandParcelType;
  totalSurfaceArea: number;
  initialValues: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

function LandParcelSoilsDistributionForm({
  currentParcelType,
  totalSurfaceArea,
  initialValues,
  onSubmit,
  onBack,
}: Props) {
  const { inputMode, onInputModeChange } = useSurfaceAreaInputMode();
  const parcelLabel = PARCEL_TYPE_LABELS[currentParcelType];

  return (
    <SurfaceAreaDistributionForm
      title={`Quelle est la superficie des différents espaces au sein de la ${parcelLabel.toLowerCase()} ?`}
      totalSurfaceArea={totalSurfaceArea}
      maxErrorMessage="La superficie ne peut pas être supérieure à la superficie totale de la parcelle"
      initialValues={initialValues}
      inputMode={inputMode}
      onInputModeChange={onInputModeChange}
      onSubmit={onSubmit}
      onBack={onBack}
      surfaces={URBAN_ZONE_SOIL_TYPES.map((soilType) => ({
        name: soilType,
        label: getLabelForSoilType(soilType),
        imgSrc: getPictogramForSoilType(soilType),
        addonText: SQUARE_METERS_HTML_SYMBOL,
        hintText: getDescriptionForSoilType(soilType),
        color: getColorForSoilType(soilType),
      }))}
    />
  );
}

export default LandParcelSoilsDistributionForm;
