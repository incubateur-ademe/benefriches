import { useForm } from "react-hook-form";
import { computePropertyTransferDutiesFromSellingPrice } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
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

type FormValues = {
  sellingPrice?: number;
  propertyTransferDuties?: number;
};

const SiteResaleRevenueForm = ({ initialValues, onSubmit, onBack }: Props) => {
  const { handleSubmit, register, watch, setValue } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const sellingPrice = watch("sellingPrice");

  return (
    <WizardFormLayout
      title="Montant de la vente du foncier aménagé"
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
            <ExternalLink href="https://explore.data.gouv.fr/fr/immobilier?onglet=carte&filtre=tous">
              Explorateur de données de valeurs foncières
            </ExternalLink>
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
          className="!pt-4"
          addonText="€"
          label="Prix de vente"
          nativeInputProps={(() => {
            const registerProps = register("sellingPrice", optionalNumericFieldRegisterOptions);
            return {
              ...registerProps,
              onChange: (e) => {
                void registerProps.onChange(e);

                const sellingPrice = parseFloat(e.target.value);
                const propertyTransferDuties =
                  sellingPrice && !isNaN(sellingPrice)
                    ? computePropertyTransferDutiesFromSellingPrice(sellingPrice)
                    : undefined;
                setValue("propertyTransferDuties", propertyTransferDuties);
              },
            };
          })()}
        />

        <RowDecimalsNumericInput
          className="!pt-4"
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
