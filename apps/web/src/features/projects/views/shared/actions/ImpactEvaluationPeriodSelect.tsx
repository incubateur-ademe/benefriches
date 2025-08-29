import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { Range } from "@codegouvfr/react-dsfr/Range";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useEffect } from "react";
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
  const { control, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues: { evaluationPeriodInYears: value },
  });

  useEffect(() => {
    reset({ evaluationPeriodInYears: value });
  }, [value, reset]);

  const formEvaluationPeriod = watch("evaluationPeriodInYears");

  return (
    <Popover className="relative">
      <PopoverButton as="div">
        <Button
          className="min-w-[165px] bg-white dark:bg-black"
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
          "w-96",
          "mt-2",
          "rounded-md",
          "bg-white dark:!bg-dsfr-contrastGrey",
          "shadow-lg",
          "ring-1 ring-black/5",
          "p-4",
          "z-40",
        )}
      >
        {({ close }) => (
          <form
            className="flex flex-col"
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

            <div className="text-xs py-4 text-[var(--text-default-info)]">
              <i className={fr.cx("fr-icon--xs", "fr-icon-info-fill")}></i> Durée à partir de la
              mise en service du projet
            </div>

            <Button
              className="self-end"
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
