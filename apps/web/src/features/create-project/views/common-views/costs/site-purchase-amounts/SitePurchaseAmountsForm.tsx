import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { computePropertyTransferDutiesFromSellingPrice } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowDecimalsNumericInput from "@/shared/views/components/form/NumericInput/RowDecimalsNumericInput";
import { optionalNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import FormDefinition from "@/shared/views/layout/WizardFormLayout/FormDefinition";
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
  const { handleSubmit, register, watch, setValue, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const sellingPrice = watch("sellingPrice");

  useEffect(() => {
    // we don't want to override the default value is form has not been touched
    if (!formState.isDirty && !!initialValues) return;

    const propertyTransferDuties =
      sellingPrice && !isNaN(sellingPrice)
        ? computePropertyTransferDutiesFromSellingPrice(sellingPrice)
        : undefined;
    setValue("propertyTransferDuties", propertyTransferDuties);
  }, [sellingPrice, setValue, formState.isDirty, initialValues]);

  return (
    <WizardFormLayout
      title="Montant de l'acquisition foncière"
      instructions={
        <>
          <FormInfo>
            <p>
              Le site sera peut-être racheté avant de procéder à l'aménagement. Vous pouvez
              renseigner ici le montant de la transaction ou passer la question.
            </p>
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
        <RowDecimalsNumericInput
          className="!tw-pt-4"
          addonText="€"
          label="Prix de vente"
          nativeInputProps={register("sellingPrice", optionalNumericFieldRegisterOptions)}
        />

        <RowDecimalsNumericInput
          className="!tw-pt-4"
          addonText="€"
          label="Droit de mutation"
          nativeInputProps={register("propertyTransferDuties", optionalNumericFieldRegisterOptions)}
        />

        <BackNextButtonsGroup onBack={onBack} nextLabel={!sellingPrice ? "Passer" : "Valider"} />
      </form>
    </WizardFormLayout>
  );
};

export default SitePurchaseAmountsForm;
