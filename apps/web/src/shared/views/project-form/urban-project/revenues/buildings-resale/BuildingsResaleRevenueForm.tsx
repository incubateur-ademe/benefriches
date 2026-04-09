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

type FormValues = {
  sellingPrice?: number;
  propertyTransferDuties?: number;
};

const BuildingsResaleRevenueForm = ({ initialValues, onSubmit, onBack }: Props) => {
  const { handleSubmit, control, watch, setValue, formState } = useForm<FormValues>({
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
      title="Montant de la vente des bâtiments"
      instructions={
        <FormInfo emoji="auto">
          <span className="title">D’où viennent les montants préremplis ?</span>
          <p>
            Montants calculés d’après le prix moyen / hectare d’une friche dans cette zone
            géographique (consulter la grille des prix)
          </p>
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
          label="Prix de vente"
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

export default BuildingsResaleRevenueForm;
