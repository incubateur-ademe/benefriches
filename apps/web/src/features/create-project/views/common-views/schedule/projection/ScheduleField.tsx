import Input from "@codegouvfr/react-dsfr/Input";
import { Control, Controller, useFormState, useWatch } from "react-hook-form";

import { getFormattedDuration } from "@/shared/services/dates";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";

import { FormValues } from "./ScheduleProjectionForm";

type Props = {
  label: string;
  scheduleName: "installationSchedule" | "reinstatementSchedule";
  control: Control<FormValues>;
};

function ScheduleField({ label, scheduleName, control }: Props) {
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
      legend={label}
      state={hasError ? "error" : "default"}
      stateRelatedMessage={
        hasError ? (
          <ul className="tw-m-0">
            {errorStartDate && <li>{errorStartDate.message ?? ""}</li>}
            {errorEndDate && <li>{errorEndDate.message ?? ""}</li>}
          </ul>
        ) : undefined
      }
    >
      <div className="tw-grid tw-gap-4 sm:tw-grid-cols-2">
        <Controller
          name={`${scheduleName}.startDate`}
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <Input
              label="Début des travaux"
              nativeInputProps={{
                type: "date",
                name,
                max: endDateValue,
                value,
                onChange: (e) => {
                  onChange(e);
                },
              }}
            />
          )}
        />
        <Controller
          name={`${scheduleName}.endDate`}
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <Input
              label="Fin des travaux"
              nativeInputProps={{
                type: "date",
                name,
                value,
                min: startDateValue,
                onChange: (e) => {
                  onChange(e);
                },
              }}
            />
          )}
        />
      </div>
      {startDateValue && endDateValue ? (
        <p>
          Soit{" "}
          <strong>{getFormattedDuration(new Date(startDateValue), new Date(endDateValue))}</strong>.
        </p>
      ) : null}
    </Fieldset>
  );
}

export default ScheduleField;
