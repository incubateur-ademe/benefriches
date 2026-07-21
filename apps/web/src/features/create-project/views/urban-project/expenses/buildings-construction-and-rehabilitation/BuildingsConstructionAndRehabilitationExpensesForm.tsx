import { useForm } from "react-hook-form";
import { sumObjectValues, typedObjectEntries } from "shared";

import { formatMoney } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import FormRowNumericInput from "@/shared/views/components/form/NumericInput/FormRowNumericInput";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type BuildingsConstructionAndRehabilitationExpensesFormValues = {
  technicalStudiesAndFees?: number;
  buildingsConstructionWorks?: number;
  buildingsRehabilitationWorks?: number;
  otherConstructionExpenses?: number;
};

type Props = {
  initialValues?: BuildingsConstructionAndRehabilitationExpensesFormValues;
  onSubmit: (data: BuildingsConstructionAndRehabilitationExpensesFormValues) => void;
  onBack: () => void;
  hasConstruction: boolean;
  hasRehabilitation: boolean;
};

export default function BuildingsConstructionAndRehabilitationExpensesForm({
  initialValues,
  onSubmit,
  onBack,
  hasConstruction,
  hasRehabilitation,
}: Props) {
  const { handleSubmit, control, watch } =
    useForm<BuildingsConstructionAndRehabilitationExpensesFormValues>({
      defaultValues: initialValues,
      shouldUnregister: true,
    });

  const allExpenses = watch();
  const hasNoValuesFilled =
    typedObjectEntries(allExpenses).filter(([, value]) => typeof value === "number").length === 0;

  return (
    <WizardFormLayout title="Dépenses de construction et de réhabilitation des bâtiments">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormRowNumericInput
          controller={{ name: "technicalStudiesAndFees", control }}
          addonText="€"
          label="Études et honoraires techniques"
        />
        {hasConstruction ? (
          <FormRowNumericInput
            controller={{ name: "buildingsConstructionWorks", control }}
            addonText="€"
            label="Travaux de construction des bâtiments"
          />
        ) : null}
        {hasRehabilitation ? (
          <FormRowNumericInput
            controller={{ name: "buildingsRehabilitationWorks", control }}
            addonText="€"
            label="Travaux de réhabilitation des bâtiments"
          />
        ) : null}
        <FormRowNumericInput
          controller={{ name: "otherConstructionExpenses", control }}
          addonText="€"
          label="Autres dépenses de construction ou de réhabilitation"
        />

        <RowNumericInput
          label={<span className="font-medium text-dsfr-text-label-grey">Total</span>}
          addonText="€"
          nativeInputProps={{
            value: formatMoney(sumObjectValues(allExpenses)),
          }}
          disabled
        />

        <BackNextButtonsGroup
          onBack={onBack}
          nextLabel={hasNoValuesFilled ? "Passer" : "Valider"}
        />
      </form>
    </WizardFormLayout>
  );
}
