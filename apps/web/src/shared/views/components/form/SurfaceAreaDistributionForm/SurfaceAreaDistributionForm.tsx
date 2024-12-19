import { ReactNode, useCallback, useMemo } from "react";
import { Path, useForm } from "react-hook-form";
import { typedObjectEntries } from "shared";
import { sumObjectValues } from "shared";

import { formatPercentage, formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import RowNumericInput from "../NumericInput/RowNumericInput";
import { optionalNumericFieldRegisterOptions } from "../NumericInput/registerOptions";
import SurfaceAreaPieChart from "./SurfaceAreaPieChart";

type FormValues<TSurface extends string> = {
  [K in TSurface]: number;
};

type Props<TSurface extends string> = {
  title: ReactNode;
  instructions?: ReactNode;
  totalSurfaceArea: number;
  surfaces: {
    name: TSurface;
    label: string;
    hintText?: ReactNode;
    imgSrc?: string;
    color?: string;
  }[];
  maxErrorMessage?: string;
  onSubmit: (data: FormValues<TSurface>) => void;
  onBack: () => void;
};

const convertPercentToSquareMeters = (percent: number, total: number) => {
  return Math.round((percent * total) / 100);
};

const targetSurfaceArea = 100;
const addonText = "%";

function SurfaceAreaDistributionForm<TSurface extends string>({
  title,
  instructions,
  surfaces,
  totalSurfaceArea,
  maxErrorMessage = "La surface de ce sol ne peut pas être supérieure à la surface totale disponible",
  onSubmit,
  onBack,
}: Props<TSurface>) {
  const { register, handleSubmit, watch } = useForm<FormValues<TSurface>>();

  const convertValuesBeforeSubmit = useCallback(
    (values: FormValues<TSurface>) => {
      const formattedEntries = typedObjectEntries(values)
        .filter(([, value]) => value && value > 0)
        .map(([key, value]) => [key, convertPercentToSquareMeters(value, totalSurfaceArea)]);
      return Object.fromEntries(formattedEntries) as Record<TSurface, number>;
    },
    [totalSurfaceArea],
  );

  const getHintInputText = useCallback(
    (value?: number) => {
      if (!value) {
        return undefined;
      }
      const equivalent = convertPercentToSquareMeters(value, totalSurfaceArea);
      return `Soit ${formatSurfaceArea(equivalent)}`;
    },
    [totalSurfaceArea],
  );

  const surfaceValues = watch();

  const totalAllocatedSurface = useMemo(() => sumObjectValues(surfaceValues), [surfaceValues]);

  const remainder = targetSurfaceArea - totalAllocatedSurface;
  const isValid = remainder === 0;

  const chartSurfaceAreaDistribution = typedObjectEntries(surfaceValues).map(
    ([soilType, value]) => {
      const { label, color } = surfaces.find(({ name }) => name === soilType) ?? {};
      return {
        name: label ?? soilType,
        value: convertPercentToSquareMeters(value, totalSurfaceArea),
        color,
      };
    },
  );

  return (
    <WizardFormLayout
      title={title}
      instructions={
        <>
          {instructions}
          <SurfaceAreaPieChart
            soilsDistribution={chartSurfaceAreaDistribution}
            remainderSurfaceArea={convertPercentToSquareMeters(remainder, totalSurfaceArea)}
          />
        </>
      }
    >
      <form
        onSubmit={handleSubmit((values: FormValues<TSurface>) => {
          onSubmit(convertValuesBeforeSubmit(values));
        })}
      >
        {surfaces.map(({ label, name, hintText, imgSrc }) => (
          <RowNumericInput
            key={name}
            label={label}
            hintText={hintText}
            hintInputText={getHintInputText(surfaceValues[name])}
            addonText={addonText}
            imgSrc={imgSrc}
            nativeInputProps={register(name as string as Path<FormValues<TSurface>>, {
              ...optionalNumericFieldRegisterOptions,
              max: {
                value: targetSurfaceArea,
                message: maxErrorMessage,
              },
            })}
          />
        ))}

        <RowNumericInput
          className="tw-pb-5"
          label="Total de toutes les surfaces"
          addonText={addonText}
          nativeInputProps={{
            value: totalAllocatedSurface,
            min: 0,
            max: targetSurfaceArea,
          }}
          disabled
          state={isValid ? "success" : "error"}
          stateRelatedMessage={
            isValid
              ? "Le compte est bon !"
              : `${formatPercentage(Math.abs(remainder))} ${remainder > 0 ? "manquants" : "en trop"}`
          }
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default SurfaceAreaDistributionForm;
