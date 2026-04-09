import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { computePropertyTransferDutiesFromSellingPrice } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import FormRowNumericInput from "@/shared/views/components/form/NumericInput/FormRowNumericInput";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  sellingPrice?: number;
  propertyTransferDuties?: number;
};

const SitePurchaseAmountsForm = ({ initialValues, onSubmit, onBack }: Props) => {
  const { handleSubmit, watch, setValue, control, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const sellingPrice = watch("sellingPrice");
  useEffect(() => {
    if (sellingPrice && !isNaN(sellingPrice) && formState.isReady) {
      setValue(
        "propertyTransferDuties",
        computePropertyTransferDutiesFromSellingPrice(sellingPrice),
      );
    }
  }, [sellingPrice, setValue, formState.isReady]);

  return (
    <WizardFormLayout
      title="Montant de l'acquisition foncière"
      instructions={
        <FormInfo>
          <ExternalLink href="https://explore.data.gouv.fr/fr/immobilier?onglet=carte&filtre=tous">
            Explorateur de données de valeurs foncières
          </ExternalLink>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormRowNumericInput
          controller={{ name: "sellingPrice", control }}
          className="pt-4!"
          addonText="€"
          label="Prix d'acquisition"
        />

        <FormRowNumericInput
          controller={{ name: "propertyTransferDuties", control }}
          className="pt-4!"
          addonText="€"
          label="Droit de mutation"
        />

        <BackNextButtonsGroup onBack={onBack} nextLabel={!sellingPrice ? "Passer" : "Valider"} />
      </form>
    </WizardFormLayout>
  );
};

export default SitePurchaseAmountsForm;
