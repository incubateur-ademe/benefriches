import { useForm } from "react-hook-form";
import { getTotalSurfaceArea, SoilsDistribution, SoilType } from "shared";

import { getSuitableSurfaceAreaForPhotovoltaicPanels } from "@/features/create-project/domain/soilsTransformation";
import {
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/services/format-number/formatNumber";
import {
  getDescriptionForSoilType,
  getLabelForSoilType,
  getPictogramForSoilType,
} from "@/shared/services/label-mapping/soilTypeLabelMapping";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import AllocatedSurfaceAreaControlInput from "./AllocatedSurfaceAreaControlInput";
import FutureSoilsSurfaceAreaInstructions from "./FutureSoilsSurfaceAreaInstructions";
import SuitableSurfaceAreaControlInput from "./SuitableSurfaceAreaControlInput";

type Props = {
  selectedSoils: SoilType[];
  siteSurfaceArea: number;
  photovoltaicPanelsSurfaceArea: number;
  currentSoilsDistribution: SoilsDistribution;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = SoilsDistribution;

function FutureSoilsSurfaceAreaForm({
  selectedSoils,
  siteSurfaceArea,
  photovoltaicPanelsSurfaceArea,
  currentSoilsDistribution,
  onSubmit,
  onBack,
}: Props) {
  const { control, handleSubmit, watch, formState } = useForm<FormValues>();

  const allocatedSoilsDistribution = watch();

  const totalAllocatedSurface = getTotalSurfaceArea(allocatedSoilsDistribution);
  const allocatedSuitableSurfaceAreaForPhotovoltaicPanels =
    getSuitableSurfaceAreaForPhotovoltaicPanels(allocatedSoilsDistribution);

  return (
    <WizardFormLayout
      title="Quelles seront les superficies des sols ?"
      instructions={<FutureSoilsSurfaceAreaInstructions />}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {selectedSoils.map((soilType) => {
          const existingSoilSurfaceArea = currentSoilsDistribution[soilType];
          const soilTypeDescription = getDescriptionForSoilType(soilType);
          const hintText = (
            <span>
              {soilTypeDescription && (
                <>
                  <span>{soilTypeDescription}</span>
                  <br />
                </>
              )}
              {existingSoilSurfaceArea
                ? `${formatSurfaceArea(existingSoilSurfaceArea)} existant`
                : null}
            </span>
          );
          return (
            <div key={soilType} className="tw-inline-flex tw-items-center tw-w-full tw-mb-6">
              <img src={getPictogramForSoilType(soilType)} width="60" className="tw-mr-4" />
              <NumericInput
                name={soilType}
                label={getLabelForSoilType(soilType)}
                hintText={hintText}
                rules={{
                  max: {
                    value: siteSurfaceArea,
                    message:
                      "La surface de ce sol ne peut pas être supérieure à la surface totale du site",
                  },
                }}
                control={control}
                addonText={SQUARE_METERS_HTML_SYMBOL}
                className="tw-w-full"
              />
            </div>
          );
        })}
        <div className="tw-mt-6">
          <SuitableSurfaceAreaControlInput
            allocatedSuitableSurfaceArea={allocatedSuitableSurfaceAreaForPhotovoltaicPanels}
            minSuitableSurfaceAreaToAllocate={photovoltaicPanelsSurfaceArea}
          />
        </div>
        <div className="tw-my-6">
          <AllocatedSurfaceAreaControlInput
            allocatedSurfaceArea={totalAllocatedSurface}
            availableSurfaceArea={siteSurfaceArea}
          />
        </div>
        <BackNextButtonsGroup
          onBack={onBack}
          nextLabel="Valider"
          disabled={!formState.isValid || totalAllocatedSurface !== siteSurfaceArea}
        />
      </form>
    </WizardFormLayout>
  );
}

export default FutureSoilsSurfaceAreaForm;
