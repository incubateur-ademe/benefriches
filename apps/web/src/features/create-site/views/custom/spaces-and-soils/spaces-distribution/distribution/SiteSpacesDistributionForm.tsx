import { SoilType, SurfaceAreaDistributionJson } from "shared";

import { useSurfaceAreaInputMode } from "@/features/create-site/views/useSurfaceAreaInputMode";
import {
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/core/format-number/formatNumber";
import {
  getDescriptionForSoilType,
  getLabelForSoilType,
  getPictogramForSoilType,
} from "@/shared/core/label-mapping/soilTypeLabelMapping";
import { getColorForSoilType } from "@/shared/core/soils";
import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

type Props = {
  initialValues: SurfaceAreaDistributionJson<SoilType>;
  siteSoils: SoilType[];
  totalSurfaceArea: number;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = SurfaceAreaDistributionJson<SoilType>;

function SiteSpacesDistributionForm({
  initialValues,
  siteSoils,
  totalSurfaceArea,
  onSubmit,
  onBack,
}: Props) {
  const { inputMode, onInputModeChange } = useSurfaceAreaInputMode();
  return (
    <SurfaceAreaDistributionForm
      initialValues={initialValues}
      title="Quelle superficie font les différents espaces ?"
      instructions={
        <FormInfo>
          La surface totale du site est de <strong>{formatSurfaceArea(totalSurfaceArea)}</strong>.
        </FormInfo>
      }
      inputMode={inputMode}
      onInputModeChange={onInputModeChange}
      onBack={onBack}
      onSubmit={onSubmit}
      totalSurfaceArea={totalSurfaceArea}
      maxErrorMessage="La superficie ne peut pas être supérieure à la superficie totale du site"
      surfaces={siteSoils.map((soilType) => ({
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

export default SiteSpacesDistributionForm;
