import Input from "@codegouvfr/react-dsfr/Input";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import type { ProjectSchedule } from "shared";

import type { Schedule } from "@/features/create-project/core/project.types";
import { stringToNumber } from "@/shared/core/number-conversion/numberConversion";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import ScheduleField from "./ScheduleField";

function formatDateForInput(date: Date) {
  return format(date, "yyyy-MM") + "-01";
}

type Props = {
  initialValues?: ProjectSchedule;
  hasReinstatement: boolean;
  installationScheduleLabel: string;
  onSubmit: (data: {
    reinstatementSchedule?: Schedule;
    installationSchedule?: Schedule;
    firstYearOfOperation: number;
  }) => void;
  onBack: () => void;
};

export type FormValues = {
  reinstatementSchedule?: Partial<Schedule>;
  installationSchedule?: Partial<Schedule>;
  firstYearOfOperation: number;
};

// Operations cannot start before the works (site reinstatement and installation) are over
const getLatestWorksEndYear = (values: FormValues): number | undefined => {
  const endYears = [values.reinstatementSchedule?.endDate, values.installationSchedule?.endDate]
    .filter((endDate): endDate is string => !!endDate)
    // read the year from the "YYYY-MM-DD" string: new Date() would parse it as UTC and could
    // shift "2030-01-01" to 2029 in a timezone behind UTC
    .map((endDate) => parseInt(endDate.slice(0, 4), 10))
    .filter((year) => !Number.isNaN(year));
  return endYears.length > 0 ? Math.max(...endYears) : undefined;
};

const formatScheduleBeforeSubmit = (schedule?: Partial<Schedule>): Schedule | undefined => {
  return schedule?.startDate && schedule.endDate
    ? { startDate: schedule.startDate, endDate: schedule.endDate }
    : undefined;
};

function ScheduleProjectionForm({
  initialValues,
  hasReinstatement,
  installationScheduleLabel,
  onSubmit,
  onBack,
}: Props) {
  const { handleSubmit, control, formState, register, trigger, getValues } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      firstYearOfOperation: initialValues?.firstYearOfOperations,
      installationSchedule: initialValues?.installation
        ? {
            startDate: formatDateForInput(initialValues.installation.startDate),
            endDate: formatDateForInput(initialValues.installation.endDate),
          }
        : undefined,
      reinstatementSchedule: initialValues?.reinstatement
        ? {
            startDate: formatDateForInput(initialValues.reinstatement.startDate),
            endDate: formatDateForInput(initialValues.reinstatement.endDate),
          }
        : undefined,
    },
  });

  const revalidateDates = (scheduleName: "reinstatementSchedule" | "installationSchedule") => {
    // only re-check the year once the user has entered one, to avoid showing a "required" error early
    const hasYear = getValues("firstYearOfOperation") !== undefined;
    void trigger(
      hasYear ? [`${scheduleName}.endDate`, "firstYearOfOperation"] : `${scheduleName}.endDate`,
    );
  };

  return (
    <WizardFormLayout title="Calendrier">
      <form
        onSubmit={handleSubmit((formData: FormValues) => {
          onSubmit({
            firstYearOfOperation: formData.firstYearOfOperation,
            installationSchedule: formatScheduleBeforeSubmit(formData.installationSchedule),
            reinstatementSchedule: formatScheduleBeforeSubmit(formData.reinstatementSchedule),
          });
        })}
      >
        {hasReinstatement && (
          <ScheduleField
            control={control}
            scheduleName="reinstatementSchedule"
            label="🚧 Remise en état de la friche"
            onDatesChange={() => {
              revalidateDates("reinstatementSchedule");
            }}
          />
        )}

        <ScheduleField
          control={control}
          scheduleName="installationSchedule"
          label={installationScheduleLabel}
          onDatesChange={() => {
            revalidateDates("installationSchedule");
          }}
        />

        <h6>🎉 Mise en service du site</h6>
        <Input
          // 50% width minus half the right arrow width and half the gap between inputs
          className="sm:w-[calc(50%-28px)]"
          label={<RequiredLabel label="Année de mise en service" />}
          state={formState.errors.firstYearOfOperation ? "error" : "default"}
          stateRelatedMessage={formState.errors.firstYearOfOperation?.message}
          nativeInputProps={{
            inputMode: "numeric",
            ...register("firstYearOfOperation", {
              setValueAs: (v?: string) => (v ? stringToNumber(v) : undefined),
              pattern: {
                value: /^(19|20|21)[\d]{2,2}$/,
                message: "Veuillez entrer une année valide",
              },
              required:
                "L'année de mise en service est nécessaire pour pouvoir calculer les impacts de votre projet.",
              min: {
                value: 2000,
                message: "Veuillez entrer une année valide",
              },
              max: {
                value: 2100,
                message: "Veuillez entrer une année valide",
              },
              validate: (year, values) => {
                const latestWorksEndYear = getLatestWorksEndYear(values);
                if (year === undefined || latestWorksEndYear === undefined) return true;
                return year >= latestWorksEndYear
                  ? true
                  : `L'année de mise en service ne peut pas être antérieure à la fin des travaux (${latestWorksEndYear})`;
              },
            }),
          }}
        />
        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default ScheduleProjectionForm;
