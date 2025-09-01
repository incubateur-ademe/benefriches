import { useForm } from "react-hook-form";
import { typedObjectEntries } from "shared";
import { sumObjectValues } from "shared";

import { formatMoney } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowDecimalsNumericInput from "@/shared/views/components/form/NumericInput/RowDecimalsNumericInput";
import { optionalNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import FormDefinition from "@/shared/views/layout/WizardFormLayout/FormDefinition";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues?: FormValues;
  submitLabel?: string;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  localOrRegionalAuthorityAmount?: number;
  publicSubsidiesAmount?: number;
  otherAmount?: number;
};

const ProjectFinancialAssistanceRevenueForm = ({
  initialValues,
  onSubmit,
  onBack,
  submitLabel,
}: Props) => {
  const { handleSubmit, register, watch } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const allRevenues = watch();

  const hasNoValuesFilled =
    typedObjectEntries(allRevenues).filter(([, value]) => typeof value === "number").length === 0;

  return (
    <WizardFormLayout
      title="Aides financières"
      instructions={
        <FormDefinition hideDivider>
          <p>
            Les montants sont exprimés en <strong>€ HT</strong>.
          </p>
          <p>Les aides financières de l'opération peuvent avoir différentes origines&nbsp;:</p>
          <ul>
            <li>
              Les subventions publiques (État, Région, ADEME, etc.) attribuées pour financer
              certaines dépenses (remise en état) ou pour soutenir le financement participatif,
            </li>

            <li>D'autres ressources le cas échéant.</li>
          </ul>
        </FormDefinition>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <RowDecimalsNumericInput
          className="pt-4!"
          addonText="€"
          label="Participation des collectivités"
          nativeInputProps={register(
            "localOrRegionalAuthorityAmount",
            optionalNumericFieldRegisterOptions,
          )}
        />

        <RowDecimalsNumericInput
          className="pt-4!"
          addonText="€"
          label="Subventions publiques"
          nativeInputProps={register("publicSubsidiesAmount", optionalNumericFieldRegisterOptions)}
        />

        <RowDecimalsNumericInput
          className="pt-4!"
          addonText="€"
          label="Autres ressources"
          nativeInputProps={register("otherAmount", optionalNumericFieldRegisterOptions)}
        />

        {!hasNoValuesFilled && (
          <p>
            <strong>
              Total des aides aux travaux : {formatMoney(sumObjectValues(allRevenues))}
            </strong>
          </p>
        )}

        <BackNextButtonsGroup
          onBack={onBack}
          nextLabel={submitLabel ?? (hasNoValuesFilled ? "Passer" : "Valider")}
        />
      </form>
    </WizardFormLayout>
  );
};

export default ProjectFinancialAssistanceRevenueForm;
