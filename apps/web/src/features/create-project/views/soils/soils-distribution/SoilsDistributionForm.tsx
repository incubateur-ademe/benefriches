import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import { isSoilFlat, isSoilNatural, SoilType, soilTypes } from "shared";
import PhotovoltaicSoilsImpactsNotice from "./PhotovoltaicSoilsImpactsNotice";
import SoilsDistributionAddButton from "./SoilsAddButton";
import TotalAllocatedSurfacesInput from "./TotalAllocatedSurfacesInput";
import TotalFlatSurfacesInput from "./TotalFlatSurfacesInput";

import { SiteDraft } from "@/features/create-site/domain/siteFoncier.types";
import { getColorForSoilType } from "@/shared/domain/soils";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SliderNumericInput from "@/shared/views/components/form/NumericInput/SliderNumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  siteSoils: SiteDraft["soilsDistribution"];
  totalSurfaceArea: number;
  minAdvisedFlatSurfaces: number;
  minAdvisedImpermeableSurface: number;
  minAdvisedMineralSurface: number;
};

type SoilsDistribution = { soilType: SoilType; surface: number };
type FormValues = {
  soilsDistribution: SoilsDistribution[];
};

const computeDefaultValues = (
  siteSoils: Props["siteSoils"],
  minAdvisedImpermeableSurface: number,
  minAdvisedMineralSurface: number,
) => {
  const siteSoilsAsArray = Object.entries(siteSoils).map(([soilType, surface]) => ({
    soilType,
    surface,
  }));

  if (minAdvisedImpermeableSurface && !siteSoils["IMPERMEABLE_SOILS"])
    siteSoilsAsArray.unshift({
      soilType: "IMPERMEABLE_SOILS",
      surface: 0,
    });
  if (minAdvisedMineralSurface && !siteSoils["MINERAL_SOIL"])
    siteSoilsAsArray.unshift({
      soilType: "MINERAL_SOIL",
      surface: 0,
    });

  return siteSoilsAsArray as SoilsDistribution[];
};

const getTotalSurface = (soilsDistribution: SoilsDistribution[]) =>
  soilsDistribution.reduce((total, { surface }) => total + surface, 0);

const getTotalFlatSurface = (soilsDistribution: SoilsDistribution[]) =>
  getTotalSurface(soilsDistribution.filter(({ soilType }) => isSoilFlat(soilType)));

const getCreatableSoils = (newSoils: SoilType[], currentSoils: SoilType[]) => {
  return soilTypes.filter(
    (soilType) =>
      !newSoils.includes(soilType) && canCreateOrIncreaseSurfaceForSoilType(soilType, currentSoils),
  );
};

const canCreateOrIncreaseSurfaceForSoilType = (soilType: SoilType, currentSoils: SoilType[]) => {
  if (
    (soilType === "PRAIRIE_GRASS" && currentSoils.includes("PRAIRIE_BUSHES")) ||
    currentSoils.includes("PRAIRIE_TREES")
  ) {
    return true;
  }
  return !isSoilNatural(soilType);
};

const mapSoilType = ({ soilType }: SoilsDistribution) => soilType;

const SLIDER_PROPS = {
  tooltip: {
    formatter: (value?: number) => value && `${formatNumberFr(value)} m²`,
  },
};

function SoilsDistributionForm({
  onSubmit,
  onBack,
  totalSurfaceArea,
  siteSoils,
  minAdvisedFlatSurfaces,
  minAdvisedImpermeableSurface,
  minAdvisedMineralSurface,
}: Props) {
  const defaultSoilsDistribution = computeDefaultValues(
    siteSoils,
    minAdvisedImpermeableSurface,
    minAdvisedMineralSurface,
  );

  const defaultValues = {
    soilsDistribution: defaultSoilsDistribution,
  };

  const { control, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues,
  });

  const { fields, append } = useFieldArray({
    control,
    name: "soilsDistribution",
  });

  const watchSoils = watch("soilsDistribution");

  // Controlled Field Array: https://react-hook-form.com/docs/usefieldarray
  const controlledSoilsFields = fields.map((field, index) => ({
    ...field,
    ...watchSoils[index],
  }));

  const totalAllocatedSurface = useMemo(
    () => getTotalSurface(controlledSoilsFields),
    [controlledSoilsFields],
  );
  const freeSurface = totalSurfaceArea - totalAllocatedSurface;
  const totalFlatSurface = useMemo(
    () => getTotalFlatSurface(controlledSoilsFields),
    [controlledSoilsFields],
  );

  const currentSiteSoilsList = Object.entries(siteSoils).map(([soilType]) => soilType as SoilType);
  const availableSoilTypes = useMemo(
    () => getCreatableSoils(controlledSoilsFields.map(mapSoilType), currentSiteSoilsList),
    [controlledSoilsFields, currentSiteSoilsList],
  );
  return (
    <WizardFormLayout
      title="Quelle sera la future répartition des sols ?"
      instructions={
        <PhotovoltaicSoilsImpactsNotice
          advisedImpermeableSurface={minAdvisedImpermeableSurface}
          advisedMineralSurface={minAdvisedMineralSurface}
          advisedFlatSurface={minAdvisedFlatSurfaces}
          siteSurfaceArea={totalSurfaceArea}
        />
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {controlledSoilsFields.map(({ soilType, surface, id }, index) => {
          const minAdvisedSurface =
            (soilType === "IMPERMEABLE_SOILS" && minAdvisedImpermeableSurface) ||
            (soilType === "MINERAL_SOIL" && minAdvisedMineralSurface) ||
            null;
          const maxValue = canCreateOrIncreaseSurfaceForSoilType(soilType, currentSiteSoilsList)
            ? freeSurface + surface
            : siteSoils[soilType];
          return (
            <SliderNumericInput
              key={id}
              control={control}
              name={`soilsDistribution.${index}.surface`}
              label={getLabelForSoilType(soilType)}
              maxValue={maxValue}
              hintText={`Actuellement : ${formatNumberFr(siteSoils[soilType] ?? 0)} m²${
                minAdvisedSurface
                  ? ` - Minimum conseillé : ${formatNumberFr(minAdvisedSurface)} m²`
                  : ""
              }`}
              sliderStartValue={0}
              sliderEndValue={totalSurfaceArea}
              sliderProps={{
                marks: {
                  [totalSurfaceArea]: formatNumberFr(totalSurfaceArea),
                  ...(minAdvisedSurface
                    ? {
                        [minAdvisedSurface]: `${formatNumberFr(minAdvisedSurface)} m²`,
                      }
                    : {}),
                },
                styles: {
                  track: {
                    background: getColorForSoilType(soilType),
                  },
                },
                ...SLIDER_PROPS,
              }}
            />
          );
        })}

        <div className="fr-py-7v tw-flex tw-justify-between">
          <Button
            onClick={() => {
              reset(defaultValues);
            }}
            priority="secondary"
            nativeButtonProps={{ type: "button" }}
          >
            Réinitialiser les valeurs
          </Button>

          <SoilsDistributionAddButton
            onValidate={(data: SoilsDistribution) => {
              append(data);
            }}
            soilTypes={availableSoilTypes}
          />
        </div>
        <TotalFlatSurfacesInput
          allocatedFlatSurface={totalFlatSurface}
          minAdvisedFlatSurface={minAdvisedFlatSurfaces}
        />
        <TotalAllocatedSurfacesInput
          totalAllocatedSurface={totalAllocatedSurface}
          totalSurface={totalSurfaceArea}
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default SoilsDistributionForm;
