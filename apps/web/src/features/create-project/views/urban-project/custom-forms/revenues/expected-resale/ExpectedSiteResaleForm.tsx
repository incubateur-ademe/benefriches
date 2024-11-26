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
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  sellingPrice?: number;
  propertyTransferDuties?: number;
};

const ExpectedSiteResaleForm = ({ onSubmit, onBack }: Props) => {
  const { handleSubmit, register, watch, setValue } = useForm<FormValues>();

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
      title="Montants de la vente du foncier aménagé"
      instructions={
        <>
          <FormInfo>
            <p>
              Il y aura peut-être une cession foncière suite à l’aménagement du site. Vous pouvez
              renseigner ici le montant attendu de la vente. Sinon vous pouvez passer la question.
            </p>
            <p>
              Les droits de mutation sont calculés automatiquement selon le prix de vente
              renseignés. Vous pouvez modifier ce montant.
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

export default ExpectedSiteResaleForm;
