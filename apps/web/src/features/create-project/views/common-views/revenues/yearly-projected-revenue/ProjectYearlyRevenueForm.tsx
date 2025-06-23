import { ReactNode } from "react";
import { DefaultValues, Path, useForm } from "react-hook-form";
import { typedObjectEntries } from "shared";
import { sumObjectValues } from "shared";

import { formatMoney } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowDecimalsNumericInput from "@/shared/views/components/form/NumericInput/RowDecimalsNumericInput";
import { optionalNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type FormValues<Fields extends readonly string[]> = {
  [K in Fields[number]]: number;
};

type Props<Fields extends readonly string[]> = {
  title: string;
  getFieldLabel: (field: Fields[number]) => string;
  instructions?: ReactNode;
  fields: Fields;
  onSubmit: (data: FormValues<Fields>) => void;
  onBack: () => void;
  initialValues?: Partial<FormValues<Fields>>;
};

export default function ProjectYearlyRevenuesForm<Fields extends readonly string[]>({
  title,
  onSubmit,
  onBack,
  getFieldLabel,
  fields,
  initialValues,
  instructions,
}: Props<Fields>) {
  const { handleSubmit, register, watch } = useForm<FormValues<Fields>>({
    defaultValues: initialValues ? (initialValues as DefaultValues<FormValues<Fields>>) : undefined,
  });

  const allRevenues = watch();

  const hasNoValuesFilled =
    typedObjectEntries(allRevenues).filter(([, value]) => typeof value === "number").length === 0;

  return (
    <WizardFormLayout title={title} instructions={instructions}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field) => {
          return (
            <RowDecimalsNumericInput
              className="!tw-pt-4"
              addonText="€ / an"
              label={getFieldLabel(field)}
              nativeInputProps={register(
                field as Path<FormValues<Fields>>,
                optionalNumericFieldRegisterOptions,
              )}
              key={field}
            />
          );
        })}

        {!hasNoValuesFilled && (
          <p>
            <strong>
              Total des recettes annuelles : {formatMoney(sumObjectValues(allRevenues))}
            </strong>
          </p>
        )}

        <BackNextButtonsGroup
          onBack={onBack}
          nextLabel={hasNoValuesFilled ? "Passer" : "Valider"}
        />
      </form>
    </WizardFormLayout>
  );
}
