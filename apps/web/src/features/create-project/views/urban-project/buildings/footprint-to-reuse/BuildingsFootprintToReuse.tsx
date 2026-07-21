import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/core/format-number/formatNumber";
import { computePercentage, computeValueFromPercentage } from "@/shared/core/percentage/percentage";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import { optionalNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import InputModeSelect from "@/shared/views/components/form/SurfaceAreaDistributionForm/InputModeSelect";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type FormValues = {
  buildingsFootprintToReuse: number | undefined;
};

type Props = {
  siteBuildingsFootprint: number;
  maxBuildingsFootprintToReuse: number;
  initialValue: number | undefined;
  onSubmit: (data: { buildingsFootprintToReuse: number }) => void;
  onBack: () => void;
};

const REQUIRED_ERROR_MESSAGE = "Ce champ est nécessaire pour déterminer les questions suivantes";
const MAX_ERROR_MESSAGE =
  "La surface réutilisée ne peut pas être supérieure à la surface de bâti existant disponible et celle prévue dans le projet";

function BuildingsFootprintToReuse({
  siteBuildingsFootprint,
  maxBuildingsFootprintToReuse,
  initialValue,
  onSubmit,
  onBack,
}: Props) {
  const [inputMode, setInputMode] = useState<"squareMeters" | "percentage">("squareMeters");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    defaultValues: { buildingsFootprintToReuse: initialValue },
    mode: "onChange",
  });

  const value = watch("buildingsFootprintToReuse");

  const handleInputModeChange = (newInputMode: "squareMeters" | "percentage") => {
    const currentValue = value ?? 0;
    const convertedValue =
      newInputMode === "percentage"
        ? computePercentage(currentValue, maxBuildingsFootprintToReuse)
        : Math.round(computeValueFromPercentage(currentValue, maxBuildingsFootprintToReuse));

    setValue("buildingsFootprintToReuse", convertedValue, {
      shouldTouch: true,
      shouldValidate: true,
    });
    setInputMode(newInputMode);
  };

  const hintInputText =
    inputMode === "percentage" && value
      ? `Soit ${formatSurfaceArea(computeValueFromPercentage(value, maxBuildingsFootprintToReuse))}`
      : undefined;

  return (
    <WizardFormLayout
      title="Quelle surface du bâti existant disponible sera utilisée pour le projet urbain ?"
      instructions={
        <FormInfo>
          <p>
            Surface de bâti existant disponible sur le site&nbsp;:{" "}
            <strong>{formatSurfaceArea(siteBuildingsFootprint)}</strong>.
          </p>
        </FormInfo>
      }
    >
      <form
        onSubmit={handleSubmit((formData) => {
          const valueInSquareMeters =
            inputMode === "percentage"
              ? Math.round(
                  computeValueFromPercentage(
                    formData.buildingsFootprintToReuse ?? 0,
                    maxBuildingsFootprintToReuse,
                  ),
                )
              : (formData.buildingsFootprintToReuse ?? 0);

          onSubmit({ buildingsFootprintToReuse: valueInSquareMeters });
        })}
      >
        <InputModeSelect value={inputMode} onChange={handleInputModeChange} />

        <RowNumericInput
          label="Surface à réutiliser"
          addonText={inputMode === "percentage" ? "%" : SQUARE_METERS_HTML_SYMBOL}
          hintText={`Max ${formatSurfaceArea(maxBuildingsFootprintToReuse)}`}
          hintInputText={hintInputText}
          state={errors.buildingsFootprintToReuse ? "error" : "default"}
          stateRelatedMessage={errors.buildingsFootprintToReuse?.message}
          nativeInputProps={register("buildingsFootprintToReuse", {
            ...optionalNumericFieldRegisterOptions,
            required: REQUIRED_ERROR_MESSAGE,
            max: {
              value: inputMode === "percentage" ? 100 : maxBuildingsFootprintToReuse,
              message: MAX_ERROR_MESSAGE,
            },
          })}
        />

        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default BuildingsFootprintToReuse;
