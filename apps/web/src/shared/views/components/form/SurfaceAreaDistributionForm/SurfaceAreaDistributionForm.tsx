import { ReactNode, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { typedObjectEntries } from "shared";
import { sumObjectValues } from "shared";

import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import SurfaceAreaControlInput from "@/shared/views/components/form/SurfaceAreaControlInput/SurfaceAreaControlInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import SurfaceAreaPieChart from "./SurfaceAreaPieChart";

type Props = {
  title: ReactNode;
  instructions?: ReactNode;
  totalSurfaceArea: number;
  soils: { name: string; label: string; hintText?: ReactNode; imgSrc?: string; color?: string }[];
  maxErrorMessage?: string;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = Record<string, number>;

function SurfaceAreaDistributionForm({
  title,
  instructions,
  soils,
  totalSurfaceArea,
  maxErrorMessage = "La surface de ce sol ne peut pas être supérieure à la surface totale disponible",
  onSubmit,
  onBack,
}: Props) {
  const { control, handleSubmit, watch } = useForm<FormValues>();

  const _onSubmit = (formData: FormValues) => {
    const entries = typedObjectEntries(formData);
    const formattedEntries = entries.filter(([, value]) => value && value > 0);
    onSubmit(Object.fromEntries(formattedEntries) as Record<string, number>);
  };

  const soilsValues = watch();

  const totalAllocatedSurface = useMemo(() => sumObjectValues(soilsValues), [soilsValues]);

  const remainder = totalSurfaceArea - totalAllocatedSurface;
  const isValid = remainder === 0;

  const chartSoilsDistribution = typedObjectEntries(soilsValues).map(([soilType, value]) => {
    const soil = soils.find(({ name }) => name === soilType);

    return {
      name: soil?.label ?? soilType,
      value,
      color: soil?.color,
    };
  });

  return (
    <WizardFormLayout
      title={title}
      instructions={
        <>
          {instructions}
          <SurfaceAreaPieChart
            soilsDistribution={chartSoilsDistribution}
            remainderSurfaceArea={remainder}
          />
        </>
      }
    >
      <form onSubmit={handleSubmit(_onSubmit)}>
        {soils.map(({ label, name, hintText, imgSrc }) => (
          <Controller
            key={name}
            control={control}
            name={name}
            rules={{
              min: {
                value: 0,
                message: "Veuillez sélectionner une superficie valide",
              },
              max: {
                value: totalSurfaceArea,
                message: maxErrorMessage,
              },
            }}
            render={(controller) => {
              return (
                <ControlledRowNumericInput
                  controlProps={controller}
                  label={label}
                  hintText={hintText}
                  addonText={SQUARE_METERS_HTML_SYMBOL}
                  imgSrc={imgSrc}
                />
              );
            }}
          />
        ))}
        <SurfaceAreaControlInput
          label="Total de toutes les surfaces"
          currentSurfaceArea={totalAllocatedSurface}
          targetSurfaceArea={totalSurfaceArea}
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default SurfaceAreaDistributionForm;
