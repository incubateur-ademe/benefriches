import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { SurfaceAreaDistribution, SurfaceAreaDistributionJson, typedObjectEntries } from "shared";

import {
  formatPercentage,
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import { useSurfaceAreaInputMode } from "@/shared/views/hooks/useSurfaceAreaInputMode";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import RowNumericInput from "../NumericInput/RowNumericInput";
import { optionalNumericFieldRegisterOptions } from "../NumericInput/registerOptions";
import InputModeSelect from "./InputModeSelect";
import SurfaceAreaPieChart from "./SurfaceAreaPieChart";

type FormValues = SurfaceAreaDistributionJson<string>;

type Props = {
  title: ReactNode;
  initialValues?: Partial<FormValues>;
  instructions?: ReactNode;
  totalSurfaceArea: number;
  surfaces: {
    name: string;
    label: string;
    hintText?: ReactNode;
    imgSrc?: string;
    color?: string;
  }[];
  maxErrorMessage?: string;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

const percentToSquareMeters = (percent: number, total: number) => {
  return Math.round((percent * total) / 100);
};

const squareMetersToPercent = (squareMeters: number, total: number) => {
  return (squareMeters / total) * 100;
};

type TotalAllocatedSurfaceAreaInputProps = {
  inputMode: "percentage" | "squareMeters";
  isValid: boolean;
  surfaceAreaAllocated: number;
  totalSurfaceAreaToAllocate: number;
};
const TotalAllocatedSurfaceAreaInput = ({
  isValid,
  surfaceAreaAllocated,
  totalSurfaceAreaToAllocate,
  inputMode,
}: TotalAllocatedSurfaceAreaInputProps) => {
  const addonText = inputMode === "percentage" ? "%" : SQUARE_METERS_HTML_SYMBOL;
  const formatValueFn = inputMode === "percentage" ? formatPercentage : formatSurfaceArea;
  const targetTotalValue = inputMode === "percentage" ? 100 : totalSurfaceAreaToAllocate;
  const remainingSurfaceAreaToAllocated = targetTotalValue - surfaceAreaAllocated;
  const missingAllocatedSurfaceMessage = `${formatValueFn(Math.abs(remainingSurfaceAreaToAllocated))} ${remainingSurfaceAreaToAllocated > 0 ? "manquants" : "en trop"}`;

  return (
    <RowNumericInput
      className="tw-pb-5"
      label="Total de toutes les surfaces"
      addonText={addonText}
      nativeInputProps={{
        value: surfaceAreaAllocated,
        min: 0,
        max: targetTotalValue,
      }}
      disabled
      state={isValid ? "success" : "error"}
      stateRelatedMessage={isValid ? "Le compte est bon !" : missingAllocatedSurfaceMessage}
    />
  );
};

const getFormValuesInSquareMeters = (input: {
  values: FormValues;
  totalSurfaceArea: number;
  inputMode: "percentage" | "squareMeters";
}): SurfaceAreaDistributionJson<string> => {
  if (input.inputMode === "squareMeters") return input.values;

  return SurfaceAreaDistribution.fromJSONPercentage({
    totalSurfaceArea: input.totalSurfaceArea,
    percentageDistribution: input.values,
  }).toJSON();
};

function SurfaceAreaDistributionForm({
  title,
  initialValues,
  instructions,
  surfaces,
  totalSurfaceArea,
  maxErrorMessage = "La surface de ce sol ne peut pas être supérieure à la surface totale disponible",
  onSubmit,
  onBack,
}: Props) {
  const { inputMode, onInputModeChange } = useSurfaceAreaInputMode();
  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: initialValues,
  });
  const surfaceValues = watch();
  const totalAllocatedSurface =
    SurfaceAreaDistribution.fromJSON(surfaceValues).getTotalSurfaceArea();

  const handleInputModeChange = (newInputMode: "percentage" | "squareMeters") => {
    onInputModeChange(newInputMode);

    typedObjectEntries(surfaceValues).map(([surfaceType, surfaceArea]) => {
      const valueToConvert = surfaceArea ?? 0;
      const convertedValue =
        newInputMode === "percentage"
          ? squareMetersToPercent(valueToConvert, totalSurfaceArea)
          : percentToSquareMeters(valueToConvert, totalSurfaceArea);
      setValue(surfaceType, convertedValue);
    });
  };

  const getHintInputText = (value?: number) => {
    if (!value || inputMode === "squareMeters") {
      return undefined;
    }
    const equivalent = percentToSquareMeters(value, totalSurfaceArea);
    return `Soit ${formatSurfaceArea(equivalent)}`;
  };

  const chartSurfaceAreaDistribution = typedObjectEntries(
    getFormValuesInSquareMeters({ inputMode, totalSurfaceArea, values: surfaceValues }),
  ).map(([soilType, surfaceArea]) => {
    const { label, color } = surfaces.find(({ name }) => name === soilType) ?? {};
    return {
      name: label ?? soilType,
      value: surfaceArea as number,
      color,
    };
  });

  const targetSurfaceArea = inputMode === "percentage" ? 100 : totalSurfaceArea;
  const remainder = targetSurfaceArea - totalAllocatedSurface;
  const isWholeSurfaceAllocated = remainder === 0;

  return (
    <WizardFormLayout
      title={title}
      instructions={
        <>
          {instructions}
          <SurfaceAreaPieChart
            soilsDistribution={chartSurfaceAreaDistribution}
            remainderSurfaceArea={percentToSquareMeters(remainder, totalSurfaceArea)}
          />
        </>
      }
    >
      <form
        onSubmit={handleSubmit((formValues: FormValues) => {
          const values = getFormValuesInSquareMeters({
            inputMode,
            totalSurfaceArea,
            values: formValues,
          });
          onSubmit(values);
        })}
      >
        <InputModeSelect value={inputMode} onChange={handleInputModeChange} />
        {surfaces.map(({ label, name, hintText, imgSrc }) => (
          <RowNumericInput
            key={name}
            label={label}
            hintText={hintText}
            hintInputText={getHintInputText(surfaceValues[name])}
            addonText={inputMode === "percentage" ? "%" : SQUARE_METERS_HTML_SYMBOL}
            imgSrc={imgSrc}
            nativeInputProps={register(name, {
              ...optionalNumericFieldRegisterOptions,
              max: {
                value: targetSurfaceArea,
                message: maxErrorMessage,
              },
            })}
          />
        ))}

        <TotalAllocatedSurfaceAreaInput
          inputMode={inputMode}
          isValid={isWholeSurfaceAllocated}
          surfaceAreaAllocated={totalAllocatedSurface}
          totalSurfaceAreaToAllocate={totalSurfaceArea}
        />
        <BackNextButtonsGroup
          onBack={onBack}
          disabled={!isWholeSurfaceAllocated}
          nextLabel="Valider"
        />
      </form>
    </WizardFormLayout>
  );
}

export default SurfaceAreaDistributionForm;
