import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { computePropertyTransferDutiesFromSellingPrice } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import FormDefinition from "@/shared/views/layout/WizardFormLayout/FormDefinition";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  sellingPrice?: number;
  propertyTransferDuties?: number;
};

const SitePurchaseAmountsForm = ({ onSubmit, onBack }: Props) => {
  const { handleSubmit, control, watch, setValue } = useForm<FormValues>();

  const sellingPrice = watch("sellingPrice");

  useEffect(() => {
    setValue(
      "propertyTransferDuties",
      sellingPrice && !isNaN(sellingPrice)
        ? computePropertyTransferDutiesFromSellingPrice(sellingPrice)
        : undefined,
    );
  }, [sellingPrice, setValue]);

  return (
    <WizardFormLayout
      title="Montant de la transaction foncière"
      instructions={
        <>
          <FormInfo>
            <p>
              Les droits de mutation sont calculés automatiquement selon le prix de vente
              renseignés. Vous pouvez modifier ces montants.
            </p>
            <p>
              Si les démarches d'acquisition ne sont pas suffisamment avancées, il est possible
              d'estimer le prix du terrain en consultant les transactions immobilières récentes à
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
          </FormInfo>
          <FormDefinition>
            <p>
              Les droits de mutation sont les taxes perçues par les collectivités et l’Etat lorsque
              qu’un patrimoine change de propriétaire.
            </p>
          </FormDefinition>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="sellingPrice"
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
                label="Prix de vente"
                addonText="€"
                className="!tw-pt-4"
              />
            );
          }}
        />

        <Controller
          control={control}
          name="propertyTransferDuties"
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
                label="Droit de mutation"
                addonText="€"
                className="!tw-pt-4"
              />
            );
          }}
        />
        <BackNextButtonsGroup onBack={onBack} nextLabel={!sellingPrice ? "Passer" : "Valider"} />
      </form>
    </WizardFormLayout>
  );
};

export default SitePurchaseAmountsForm;
