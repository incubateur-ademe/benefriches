import { useForm } from "react-hook-form";
import { getTotalSurfaceArea, SoilsDistribution, SoilType } from "shared";
import AllocatedSurfaceAreaControlInput from "./AllocatedSurfaceAreaControlInput";
import FutureSoilsSurfaceAreaInstructions from "./FutureSoilsSurfaceAreaInstructions";
import SuitableSurfaceAreaControlInput from "./SuitableSurfaceAreaControlInput";

import { getSuitableSurfaceAreaForPhotovoltaicPanels } from "@/features/create-project/domain/soilsTransformation";
import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import {
  getDescriptionForSoilType,
  getLabelForSoilType,
  getPictogramForSoilType,
} from "@/shared/services/label-mapping/soilTypeLabelMapping";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  selectedSoils: SoilType[];
  siteSurfaceArea: number;
  minimumRecommendedMineralSurfaceArea: number;
  minimumRecommendedImpermeableSurfaceArea: number;
  photovoltaicPanelsSurfaceArea: number;
  currentSoilsDistribution: SoilsDistribution;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = SoilsDistribution;

function FutureSoilsSurfaceAreaForm({
  selectedSoils,
  siteSurfaceArea,
  minimumRecommendedMineralSurfaceArea,
  minimumRecommendedImpermeableSurfaceArea,
  photovoltaicPanelsSurfaceArea,
  currentSoilsDistribution,
  onSubmit,
  onBack,
}: Props) {
  const { control, handleSubmit, watch } = useForm<FormValues>();

  const allocatedSoilsDistribution = watch();

  const totalAllocatedSurface = getTotalSurfaceArea(allocatedSoilsDistribution);
  const allocatedSuitableSurfaceAreaForPhotovoltaicPanels =
    getSuitableSurfaceAreaForPhotovoltaicPanels(allocatedSoilsDistribution);

  const _onSubmit = (data: FormValues) => {
    const allocatedSurfaceArea = getTotalSurfaceArea(data);
    if (allocatedSurfaceArea !== siteSurfaceArea) return;
    onSubmit(data);
  };

  return (
    <WizardFormLayout
      title="Quelles seront les superficies des sols ?"
      instructions={
        <FutureSoilsSurfaceAreaInstructions
          availableSurfaceArea={siteSurfaceArea}
          minimumRecommendedImpermeableSurfaceArea={minimumRecommendedImpermeableSurfaceArea}
          minimumRecommendedMineralSurfaceArea={minimumRecommendedMineralSurfaceArea}
          photovoltaicPanelsSurfaceArea={photovoltaicPanelsSurfaceArea}
        />
      }
    >
      <form onSubmit={handleSubmit(_onSubmit)}>
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
              <img
                src={`/img/pictograms/soil-types/${getPictogramForSoilType(soilType)}`}
                width="60"
                className="tw-mr-4"
              />
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
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default FutureSoilsSurfaceAreaForm;
