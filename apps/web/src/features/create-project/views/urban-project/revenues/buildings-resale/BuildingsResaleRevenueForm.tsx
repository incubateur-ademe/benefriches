import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { computePropertyTransferDutiesFromSellingPrice } from "shared";

import type { RelatedSiteCityReferenceData } from "@/features/create-project/core/project-form/projectSite.types";
import { formatMoney } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import DefaultValueSwitch from "@/shared/views/components/form/DefaultValuesSwitch/DefaultValueSwitch";
import FormRowNumericInput from "@/shared/views/components/form/NumericInput/FormRowNumericInput";
import FormWarning from "@/shared/views/layout/WizardFormLayout/FormWarning";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import SiteRealEstateValuesExplanation from "../../../project-form/modal-content/SiteRealEstateValuesExplanation";

type Props = {
  defaultValues: FormValues | undefined;
  currentValues: FormValues | undefined;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  landAndRealEstateValues?: {
    cityName?: string;
    addressLabel: string;
  } & RelatedSiteCityReferenceData["landAndRealEstateValues"];
};

type FormValues = {
  sellingPrice?: number;
  propertyTransferDuties?: number;
};

const EMPTY_VALUES = {
  sellingPrice: undefined,
  propertyTransferDuties: undefined,
};

const BuildingsResaleRevenueForm = ({
  currentValues,
  defaultValues,
  onSubmit,
  onBack,
  landAndRealEstateValues,
}: Props) => {
  const { handleSubmit, control, watch, setValue, formState, reset } = useForm<FormValues>({
    defaultValues: EMPTY_VALUES,
    values: currentValues,
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
    <WizardFormLayout title="Montant de la vente des bâtiments">
      <form onSubmit={handleSubmit(onSubmit)}>
        {defaultValues?.sellingPrice ? (
          <DefaultValueSwitch
            defaultChecked={sellingPrice === defaultValues.sellingPrice}
            badge={<>Valeur estimée: {formatMoney(defaultValues.sellingPrice)}</>}
            ModalContent={
              landAndRealEstateValues && (
                <SiteRealEstateValuesExplanation {...landAndRealEstateValues} />
              )
            }
            onChange={(checked) => {
              if (checked) {
                reset(defaultValues);
                return;
              }
              reset(
                currentValues?.sellingPrice === defaultValues.sellingPrice
                  ? EMPTY_VALUES
                  : currentValues,
              );
            }}
          />
        ) : (
          <FormWarning>
            <div>
              <strong>Estimation indisponible</strong>
              <p>
                Nous n'avons pas pu trouver de données pertinentes pour estimer le prix de revente
                des bâtiments. Vous pouvez saisir les montants manuellement si vous les connaissez,
                ou passer cette étape.
              </p>
              <ExternalLink href="https://explore.data.gouv.fr/fr/immobilier?onglet=carte&filtre=tous">
                Explorateur de données de valeurs foncières
              </ExternalLink>
            </div>
          </FormWarning>
        )}
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
