import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { computeTransferTaxFromSellingPrice } from "@/features/create-project/domain/defaultValues";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  sellingPrice?: number;
  propertyTransferDuties?: number;
};

const RealEstateTransactionCostsForm = ({ onSubmit, onBack }: Props) => {
  const { handleSubmit, control, watch, setValue } = useForm<FormValues>();

  const sellingPrice = watch("sellingPrice");

  useEffect(() => {
    setValue(
      "propertyTransferDuties",
      sellingPrice && !isNaN(sellingPrice)
        ? computeTransferTaxFromSellingPrice(sellingPrice)
        : undefined,
    );
  }, [sellingPrice, setValue]);

  return (
    <WizardFormLayout
      title="Montant de la transaction immobilière"
      instructions={
        <>
          <p>Le prix de vente est à renseigner par l’utilisateur.</p>
          <p>
            Les droits de mutation sont calculés automatiquement selon le prix de vente renseignés.
            Vous pouvez modifier ces montants.
          </p>
          <p>
            Si les démarches d’acquisition ne sont pas suffisamment avancées, il est possible
            d’estimer le prix du terrain en consultant les transactions immobilières récentes à
            proximité de votre site.
          </p>

          <a
            title="Explorateur de données de valeurs foncières - ouvre une nouvelle fenêtre"
            target="_blank"
            rel="noopener noreferrer external"
            href="https://explore.data.gouv.fr/fr/immobilier?onglet=carte&filtre=tous"
          >
            Explorateur de données de valeurs foncières
          </a>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          control={control}
          label="Prix de vente"
          hintText="€"
          name="sellingPrice"
          rules={{
            min: {
              value: 0,
              message: "Veuillez entrer un montant valide",
            },
          }}
        />

        <NumericInput
          control={control}
          label="Droit de mutation"
          hintText="€"
          name="propertyTransferDuties"
          rules={{
            min: {
              value: 0,
              message: "Veuillez entrer un montant valide",
            },
          }}
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
};

export default RealEstateTransactionCostsForm;
