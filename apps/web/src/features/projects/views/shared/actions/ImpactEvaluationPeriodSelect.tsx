import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { Range } from "@codegouvfr/react-dsfr/Range";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Controller, useForm } from "react-hook-form";

import classNames from "@/shared/views/clsx";

type Props = {
  value: number;
  onChange: (n: number) => void;
};

const formatValue = (value: number) =>
  value.toString() === "1" ? `Durée : ${value} an` : `Durée : ${value} ans`;

type FormValues = {
  evaluationPeriodInYears: number;
};

function ImpactEvaluationPeriodSelect({ value, onChange }: Props) {
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: { evaluationPeriodInYears: value },
  });

  const formEvaluationPeriod = watch("evaluationPeriodInYears");

  return (
    <Popover className="relative">
      <PopoverButton>
        <Button
          className="tw-min-w-[165px] tw-bg-white dark:tw-bg-black"
          iconId="fr-icon-arrow-down-s-line"
          iconPosition="right"
          priority="secondary"
        >
          {formatValue(value)}
        </Button>
      </PopoverButton>
      <PopoverPanel
        anchor="bottom end"
        className={classNames(
          "tw-w-96",
          "tw-mt-2",
          "tw-rounded-md",
          "tw-bg-white dark:!tw-bg-dsfr-contrastGrey",
          "tw-shadow-lg",
          "tw-ring-1 tw-ring-black/5",
          "tw-p-4",
          "tw-z-40",
        )}
      >
        {({ close }) => (
          <form
            className="tw-flex tw-flex-col"
            onSubmit={handleSubmit((formData) => {
              onChange(formData.evaluationPeriodInYears);
              close();
            })}
          >
            <Controller
              defaultValue={value}
              control={control}
              name="evaluationPeriodInYears"
              render={({ field }) => (
                <Range
                  label="Durée"
                  max={50}
                  min={1}
                  suffix=" an(s)"
                  nativeInputProps={{
                    value: field.value,
                    onChange: field.onChange,
                  }}
                />
              )}
            />

            <div className="tw-text-xs tw-py-4 tw-text-[var(--text-default-info)]">
              <i className={fr.cx("fr-icon--xs", "fr-icon-info-fill")}></i> Durée à partir de la
              mise en service du projet
            </div>

            <Button
              className="tw-self-end"
              size="small"
              type="submit"
              disabled={value === formEvaluationPeriod}
            >
              Changer la durée
            </Button>
          </form>
        )}
      </PopoverPanel>
    </Popover>
  );
}

export default ImpactEvaluationPeriodSelect;
