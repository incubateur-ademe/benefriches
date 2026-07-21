import { useForm } from "react-hook-form";
import { roundToInteger } from "shared";

import {
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/core/format-number/formatNumber";
import { computePercentage, computeValueFromPercentage } from "@/shared/core/percentage/percentage";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowDecimalsNumericInput from "@/shared/views/components/form/NumericInput/RowDecimalsNumericInput";
import { requiredNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import InputModeSelect from "@/shared/views/components/form/SurfaceAreaDistributionForm/InputModeSelect";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type InputMode = "percentage" | "squareMeters";

type Props = {
  initialValues?: FormValues;
  onSubmit: (surfaceArea: number) => void;
  onBack: () => void;
  contaminatedSoilSurface: number;
  inputMode: InputMode;
  onInputModeChange: (inputMode: InputMode) => void;
};

type FormValues = {
  surfaceArea: number;
};

function SoilsDecontaminationSurfaceArea({
  initialValues,
  onSubmit,
  onBack,
  contaminatedSoilSurface,
  inputMode,
  onInputModeChange,
}: Props) {
  const { handleSubmit, register, formState, watch, setValue } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const surfaceAreaValue = watch("surfaceArea");
  const surfaceAreaInSquareMeters =
    inputMode === "percentage"
      ? computeValueFromPercentage(surfaceAreaValue, contaminatedSoilSurface)
      : surfaceAreaValue;
  const surfaceAreaInPercentage =
    inputMode === "squareMeters"
      ? roundToInteger(computePercentage(surfaceAreaValue, contaminatedSoilSurface))
      : surfaceAreaValue;

  const handleInputModeChange = (newInputMode: InputMode) => {
    onInputModeChange(newInputMode);

    const convertedValue =
      newInputMode === "percentage" ? surfaceAreaInPercentage : surfaceAreaInSquareMeters;
    setValue("surfaceArea", convertedValue);
  };

  const addonText = inputMode === "percentage" ? "%" : SQUARE_METERS_HTML_SYMBOL;
  const maxValue = inputMode === "percentage" ? 100 : contaminatedSoilSurface;

  const getHintInputText = () => {
    const equivalentSurfaceAreaMessage =
      inputMode === "percentage"
        ? formatSurfaceArea(surfaceAreaInSquareMeters)
        : surfaceAreaInPercentage + "%";
    return (
      <p>
        💡 Soit <strong>{equivalentSurfaceAreaMessage}</strong>
      </p>
    );
  };

  return (
    <WizardFormLayout title="Quelle part des sols pollués sera dépolluée&nbsp;?">
      <form
        onSubmit={handleSubmit(() => {
          onSubmit(surfaceAreaInSquareMeters);
        })}
      >
        <InputModeSelect value={inputMode} onChange={handleInputModeChange} />
        <RowDecimalsNumericInput
          addonText={addonText}
          hintText={`Surface contaminée : ${formatSurfaceArea(contaminatedSoilSurface)}`}
          hintInputText={getHintInputText()}
          label={<RequiredLabel label="Part à dépolluer" />}
          nativeInputProps={register("surfaceArea", {
            ...requiredNumericFieldRegisterOptions,
            max: {
              value: maxValue,
              message:
                "La superficie dépolluée ne peut être supérieure à la superficie polluée du site.",
            },
          })}
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default SoilsDecontaminationSurfaceArea;
