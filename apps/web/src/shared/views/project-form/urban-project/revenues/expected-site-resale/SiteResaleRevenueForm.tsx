import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { computePropertyTransferDutiesFromSellingPrice } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import FormRowNumericInput from "@/shared/views/components/form/NumericInput/FormRowNumericInput";
import { optionalNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import FormAutoInfo from "@/shared/views/layout/WizardFormLayout/FormAutoInfo";
import FormWarning from "@/shared/views/layout/WizardFormLayout/FormWarning";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues?: FormValues;
  shouldSiteResalePriceBeEstimated?: boolean;
  estimationFailed?: boolean;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = {
  sellingPrice?: number;
  propertyTransferDuties?: number;
};

const SiteResaleRevenueForm = ({
  initialValues,
  shouldSiteResalePriceBeEstimated,
  estimationFailed,
  onSubmit,
  onBack,
}: Props) => {
  const { handleSubmit, register, control, watch, setValue, formState } = useForm<FormValues>({
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
      title="Montant de la vente du foncier aménagé"
      instructions={
        estimationFailed ? (
          <FormWarning>
            Estimation indisponible
            <p>
              Nous n'avons pas pu trouver de données pertinentes pour estimer le prix de revente du
              site. Vous pouvez saisir les montants manuellement si vous les connaissez, ou passer
              cette étape.
            </p>
          </FormWarning>
        ) : shouldSiteResalePriceBeEstimated ? (
          <FormAutoInfo>
            D’où viennent les montants préremplis ?
            <p>
              Montants calculés d’après le prix moyen / hectare d’une friche dans cette zone
              géographique
            </p>
          </FormAutoInfo>
        ) : undefined
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormRowNumericInput
          controller={{ name: "sellingPrice", control }}
          className="pt-4!"
          addonText="€"
          label="Prix de vente"
        />

        <FormRowNumericInput
          controller={{ name: "propertyTransferDuties", control }}
          className="pt-4!"
          addonText="€"
          label="Droit de mutation"
          nativeInputProps={register("propertyTransferDuties", optionalNumericFieldRegisterOptions)}
        />

        <BackNextButtonsGroup onBack={onBack} nextLabel={!sellingPrice ? "Passer" : "Valider"} />
      </form>
    </WizardFormLayout>
  );
};

export default SiteResaleRevenueForm;
