import type { ReactNode } from "react";
import { useForm } from "react-hook-form";

import {
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import RowDecimalsNumericInput from "@/shared/views/components/form/NumericInput/RowDecimalsNumericInput";
import { requiredNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import RadioButton from "@/shared/views/components/form/RadioButton/RadioButton";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type HasContaminatedSoilsString = "yes" | "no" | null;

type FormValues = {
  hasContaminatedSoils: HasContaminatedSoilsString;
  contaminatedSurface?: number;
};

type Props = {
  title: string;
  instructions?: ReactNode;
  onSubmit: (data: { hasContaminatedSoils: boolean; contaminatedSoilSurface?: number }) => void;
  onBack: () => void;
  siteSurfaceArea: number;
  initialValues: {
    hasContaminatedSoils: boolean | undefined;
    contaminatedSoilSurface: number | undefined;
  };
};

function toHasContaminatedSoilsString(value: boolean | undefined): HasContaminatedSoilsString {
  if (value === undefined) return null;
  return value ? "yes" : "no";
}

function SoilContaminationForm({
  title,
  instructions,
  initialValues,
  onSubmit,
  onBack,
  siteSurfaceArea,
}: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
    defaultValues: {
      hasContaminatedSoils: toHasContaminatedSoilsString(initialValues.hasContaminatedSoils),
      contaminatedSurface: initialValues.contaminatedSoilSurface ?? 0,
    },
  });

  const hasContaminatedSoilsError = formState.errors.hasContaminatedSoils;
  const contaminatedSurfaceHintText = `(maximum ${formatSurfaceArea(siteSurfaceArea)})`;

  const hasContaminatedSoilsValue = watch("hasContaminatedSoils");
  const hasContaminatedSoils = hasContaminatedSoilsValue === "yes";

  return (
    <WizardFormLayout title={title} instructions={instructions}>
      <form
        onSubmit={handleSubmit(({ hasContaminatedSoils: value, contaminatedSurface }) => {
          onSubmit({
            hasContaminatedSoils: value === "yes",
            contaminatedSoilSurface: contaminatedSurface,
          });
        })}
      >
        <Fieldset
          state={hasContaminatedSoilsError ? "error" : "default"}
          stateRelatedMessage={
            hasContaminatedSoilsError ? hasContaminatedSoilsError.message : undefined
          }
        >
          <RadioButton label="Oui" value="yes" {...register("hasContaminatedSoils")} />
          {hasContaminatedSoils && (
            <div className="pb-7">
              <RowDecimalsNumericInput
                label={<RequiredLabel label="Superficie polluée" />}
                addonText={SQUARE_METERS_HTML_SYMBOL}
                hintText={contaminatedSurfaceHintText}
                nativeInputProps={register("contaminatedSurface", {
                  ...requiredNumericFieldRegisterOptions,
                  max: {
                    value: siteSurfaceArea,
                    message:
                      "La superficie polluée ne peut être supérieure à la superficie du site.",
                  },
                })}
              />
            </div>
          )}
          <RadioButton {...register("hasContaminatedSoils")} label="Non / Ne sait pas" value="no" />
        </Fieldset>

        <BackNextButtonsGroup
          onBack={onBack}
          disabled={!formState.isValid}
          nextLabel={hasContaminatedSoilsValue !== null ? "Valider" : "Passer"}
        />
      </form>
    </WizardFormLayout>
  );
}

export default SoilContaminationForm;
