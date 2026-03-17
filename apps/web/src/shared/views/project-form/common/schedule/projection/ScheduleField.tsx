import { Control, Controller, useFormState, useWatch } from "react-hook-form";

import { getFormattedDuration } from "@/shared/core/dates";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import MonthYearInput from "@/shared/views/components/form/MonthYearInput/MonthYearInput";

import { FormValues } from "./ScheduleProjectionForm";

type Props = {
  label: string;
  scheduleName: "installationSchedule" | "reinstatementSchedule";
  control: Control<FormValues>;
  onStartDateChange: () => void;
};

function ScheduleField({ label, scheduleName, control, onStartDateChange }: Props) {
  const formValues = useWatch({ control });
  const formState = useFormState({
    control,
  });

  const { errors } = formState;
  const errorStartDate = errors[scheduleName]?.startDate;
  const errorEndDate = errors[scheduleName]?.endDate;
  const hasError = errorStartDate || errorEndDate;

  const startDateValue = formValues[scheduleName]?.startDate;
  const endDateValue = formValues[scheduleName]?.endDate;

  return (
    <Fieldset
      state={hasError ? "error" : "default"}
      stateRelatedMessage={
        hasError ? (
          <>
            {errorStartDate?.message}
            {errorStartDate && errorEndDate && <br />}
            {errorEndDate?.message}
          </>
        ) : undefined
      }
    >
      <div className="mb-4">
        <h6>{label}</h6>
        <div className="sm:gap-4 sm:flex">
          <Controller
            name={`${scheduleName}.startDate`}
            control={control}
            render={({ field }) => (
              <MonthYearInput
                label="Début des travaux"
                className="w-full"
                value={field.value ?? ""}
                onChange={(dateString) => {
                  field.onChange(dateString);
                  onStartDateChange();
                }}
                onBlur={field.onBlur}
                name={field.name}
              />
            )}
          />
          <span className="fr-icon-arrow-right-line hidden sm:inline m-auto" aria-hidden="true" />
          <Controller
            name={`${scheduleName}.endDate`}
            control={control}
            rules={{
              validate: (value) => {
                if (!value || !startDateValue) return true;
                if (value < startDateValue) {
                  return "La date de fin doit être après la date de début";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <MonthYearInput
                label="Fin des travaux"
                className="w-full"
                value={field.value ?? ""}
                onChange={(dateString) => {
                  field.onChange(dateString);
                }}
                onBlur={field.onBlur}
                name={field.name}
              />
            )}
          />
        </div>
        {startDateValue && endDateValue && !hasError ? (
          <p>
            Soit{" "}
            <strong>
              {getFormattedDuration(new Date(startDateValue), new Date(endDateValue))}
            </strong>
            .
          </p>
        ) : null}
      </div>
    </Fieldset>
  );
}

export default ScheduleField;
