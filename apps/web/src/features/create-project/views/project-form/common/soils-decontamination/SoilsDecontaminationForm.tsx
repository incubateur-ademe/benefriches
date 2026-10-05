import { useForm } from "react-hook-form";
import { roundTo2Digits, roundToInteger } from "shared";

import type { DecontaminationPlan } from "@/features/create-project/core/project-form/soilsDecontamination";
import {
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/core/format-number/formatNumber";
import { computePercentage, computeValueFromPercentage } from "@/shared/core/percentage/percentage";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import RowDecimalsNumericInput from "@/shared/views/components/form/NumericInput/RowDecimalsNumericInput";
import { requiredNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import RadioButton from "@/shared/views/components/form/RadioButton/RadioButton";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import InputModeSelect from "@/shared/views/components/form/SurfaceAreaDistributionForm/InputModeSelect";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type InputMode = "percentage" | "squareMeters";

export type SoilsDecontaminationFormData = {
  decontaminationPlan: DecontaminationPlan;
  // Only set for "partial": the surface of the other plans is resolved by the wizard.
  decontaminatedSurfaceArea?: number;
};

type Props = {
  initialValues?: { decontaminationPlan: DecontaminationPlan; decontaminatedSurfaceArea?: number };
  contaminatedSoilSurface: number;
  inputMode: InputMode;
  onInputModeChange: (inputMode: InputMode) => void;
  onSubmit: (data: SoilsDecontaminationFormData) => void;
  onBack: () => void;
};

type FormValues = {
  decontaminationPlan: DecontaminationPlan | null;
  // In the current input mode: % of the contaminated surface or m².
  surfaceArea?: number;
};

const toInputModeValue = (
  surfaceArea: number,
  contaminatedSoilSurface: number,
  inputMode: InputMode,
) =>
  inputMode === "percentage"
    ? computePercentage(surfaceArea, contaminatedSoilSurface)
    : surfaceArea;

function SoilsDecontaminationForm({
  initialValues,
  contaminatedSoilSurface,
  inputMode,
  onInputModeChange,
  onSubmit,
  onBack,
}: Props) {
  const { register, handleSubmit, formState, watch, setValue } = useForm<FormValues>({
    // Switching away from "Oui" unmounts the surface input and drops its value.
    shouldUnregister: true,
    defaultValues: {
      decontaminationPlan: initialValues?.decontaminationPlan ?? null,
      surfaceArea:
        initialValues?.decontaminationPlan === "partial" &&
        initialValues.decontaminatedSurfaceArea !== undefined
          ? toInputModeValue(
              initialValues.decontaminatedSurfaceArea,
              contaminatedSoilSurface,
              inputMode,
            )
          : undefined,
    },
  });

  const decontaminationPlan = watch("decontaminationPlan");
  const surfaceAreaValue = watch("surfaceArea") ?? 0;

  // Rounded so that a stored surface shown as a non-round percentage (1000 m² of 3000 m²)
  // converts back to the same m² value instead of 999.9999999999998.
  const surfaceAreaInSquareMeters =
    inputMode === "percentage"
      ? roundTo2Digits(computeValueFromPercentage(surfaceAreaValue, contaminatedSoilSurface))
      : surfaceAreaValue;
  const surfaceAreaInPercentage =
    inputMode === "squareMeters"
      ? roundToInteger(computePercentage(surfaceAreaValue, contaminatedSoilSurface))
      : surfaceAreaValue;

  const handleInputModeChange = (newInputMode: InputMode) => {
    onInputModeChange(newInputMode);
    setValue(
      "surfaceArea",
      newInputMode === "percentage" ? surfaceAreaInPercentage : surfaceAreaInSquareMeters,
    );
  };

  const equivalentSurfaceAreaMessage =
    inputMode === "percentage"
      ? formatSurfaceArea(surfaceAreaInSquareMeters)
      : `${surfaceAreaInPercentage}%`;

  return (
    <WizardFormLayout title="Est-il nécessaire de dépolluer les sols&nbsp;?">
      <form
        onSubmit={handleSubmit((formData) => {
          const plan = formData.decontaminationPlan ?? "unknown";
          onSubmit(
            plan === "partial"
              ? { decontaminationPlan: plan, decontaminatedSurfaceArea: surfaceAreaInSquareMeters }
              : { decontaminationPlan: plan },
          );
        })}
      >
        <Fieldset>
          <RadioButton label="Oui" value="partial" {...register("decontaminationPlan")} />
          {decontaminationPlan === "partial" && (
            <div className="pb-7">
              <InputModeSelect value={inputMode} onChange={handleInputModeChange} />
              <RowDecimalsNumericInput
                addonText={inputMode === "percentage" ? "%" : SQUARE_METERS_HTML_SYMBOL}
                hintText={`Surface contaminée : ${formatSurfaceArea(contaminatedSoilSurface)}`}
                hintInputText={
                  <p>
                    💡 Soit <strong>{equivalentSurfaceAreaMessage}</strong>
                  </p>
                }
                label={<RequiredLabel label="Part à dépolluer" />}
                nativeInputProps={register("surfaceArea", {
                  ...requiredNumericFieldRegisterOptions,
                  max: {
                    value: inputMode === "percentage" ? 100 : contaminatedSoilSurface,
                    message:
                      "La superficie dépolluée ne peut être supérieure à la superficie polluée du site.",
                  },
                })}
              />
            </div>
          )}
          <RadioButton label="Non" value="none" {...register("decontaminationPlan")} />
          <RadioButton
            label="Ne sait pas"
            value="unknown"
            hintText="Bénéfriches appliquera un ratio de 25% aux sols pollués."
            {...register("decontaminationPlan")}
          />
        </Fieldset>
        <BackNextButtonsGroup
          onBack={onBack}
          disabled={!formState.isValid}
          nextLabel={decontaminationPlan !== null ? "Valider" : "Passer"}
        />
      </form>
    </WizardFormLayout>
  );
}

export default SoilsDecontaminationForm;
