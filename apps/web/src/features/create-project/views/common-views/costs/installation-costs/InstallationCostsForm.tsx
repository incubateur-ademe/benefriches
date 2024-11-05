import { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { typedObjectEntries } from "shared";
import { sumObjectValues } from "shared";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  title: ReactNode;
  instructions?: ReactNode;
  defaultValues?: {
    works: number;
    technicalStudy: number;
    other: number;
  };
};

export type FormValues = {
  worksAmount?: number;
  technicalStudyAmount?: number;
  otherAmount?: number;
};

const InstallationExpensesForm = ({
  onSubmit,
  onBack,
  defaultValues,
  title,
  instructions,
}: Props) => {
  const { handleSubmit, control, watch } = useForm<FormValues>({
    defaultValues: {
      worksAmount: defaultValues?.works,
      technicalStudyAmount: defaultValues?.technicalStudy,
      otherAmount: defaultValues?.other,
    },
  });

  const allExpenses = watch();

  const hasNoValuesFilled =
    typedObjectEntries(allExpenses).filter(([, value]) => typeof value === "number").length === 0;

  return (
    <WizardFormLayout title={title} instructions={instructions}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="worksAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez entrer un montant valide",
            },
          }}
          render={(controller) => {
            return (
              <ControlledRowNumericInput
                controlProps={controller}
                label="Travaux d'installation"
                addonText="€"
                className="!tw-pt-4"
              />
            );
          }}
        />

        <Controller
          control={control}
          name="technicalStudyAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez entrer un montant valide",
            },
          }}
          render={(controller) => {
            return (
              <ControlledRowNumericInput
                controlProps={controller}
                label="Études et honoraires techniques"
                addonText="€"
                className="!tw-pt-4"
              />
            );
          }}
        />
        <Controller
          control={control}
          name="otherAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez entrer un montant valide",
            },
          }}
          render={(controller) => {
            return (
              <ControlledRowNumericInput
                controlProps={controller}
                label="Autres dépenses d'installation"
                addonText="€"
                className="!tw-pt-4"
              />
            );
          }}
        />

        {!hasNoValuesFilled && (
          <p>
            <strong>
              Total des dépenses d'installation : {formatNumberFr(sumObjectValues(allExpenses))} €
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
};

export default InstallationExpensesForm;
