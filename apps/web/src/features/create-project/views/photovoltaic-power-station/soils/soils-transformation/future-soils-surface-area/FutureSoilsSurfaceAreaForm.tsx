import { useForm } from "react-hook-form";
import {
  createSoilSurfaceAreaDistribution,
  SoilsDistribution,
  SoilType,
  getSuitableSurfaceAreaForPhotovoltaicPanels,
} from "shared";

import {
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/core/format-number/formatNumber";
import {
  getDescriptionForSoilType,
  getLabelForSoilType,
  getPictogramForSoilType,
} from "@/shared/core/label-mapping/soilTypeLabelMapping";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowDecimalsNumericInput from "@/shared/views/components/form/NumericInput/RowDecimalsNumericInput";
import { optionalNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import AllocatedSurfaceAreaControlInput from "./AllocatedSurfaceAreaControlInput";
import FutureSoilsSurfaceAreaInstructions from "./FutureSoilsSurfaceAreaInstructions";
import SuitableSurfaceAreaControlInput from "./SuitableSurfaceAreaControlInput";

type Props = {
  initialValues?: FormValues;
  selectedSoils: SoilType[];
  siteSurfaceArea: number;
  photovoltaicPanelsSurfaceArea: number;
  currentSoilsDistribution: SoilsDistribution;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = SoilsDistribution;

function FutureSoilsSurfaceAreaForm({
  initialValues,
  selectedSoils,
  siteSurfaceArea,
  photovoltaicPanelsSurfaceArea,
  currentSoilsDistribution,
  onSubmit,
  onBack,
}: Props) {
  const { register, handleSubmit, watch, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const allocatedSoilsDistribution = watch();

  const totalAllocatedSurface = createSoilSurfaceAreaDistribution(
    allocatedSoilsDistribution,
  ).getTotalSurfaceArea();
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
            <RowDecimalsNumericInput
              key={soilType}
              imgSrc={getPictogramForSoilType(soilType)}
              nativeInputProps={register(soilType, {
                ...optionalNumericFieldRegisterOptions,
                max: {
                  value: siteSurfaceArea,
                  message:
                    "La surface de ce sol ne peut pas être supérieure à la surface totale du site",
                },
              })}
              label={getLabelForSoilType(soilType)}
              hintText={hintText}
              addonText={SQUARE_METERS_HTML_SYMBOL}
              className="w-full"
            />
          );
        })}
        <div className="mt-6">
          <SuitableSurfaceAreaControlInput
            allocatedSuitableSurfaceArea={allocatedSuitableSurfaceAreaForPhotovoltaicPanels}
            minSuitableSurfaceAreaToAllocate={photovoltaicPanelsSurfaceArea}
          />
        </div>
        <div className="my-6">
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
