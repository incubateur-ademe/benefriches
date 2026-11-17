import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { computePropertyTransferDutiesFromSellingPrice } from "shared";

import { formatMoney } from "@/shared/core/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import DefaultValueSwitch from "@/shared/views/components/form/DefaultValuesSwitch/DefaultValueSwitch";
import FormRowNumericInput from "@/shared/views/components/form/NumericInput/FormRowNumericInput";
import FormWarning from "@/shared/views/layout/WizardFormLayout/FormWarning";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import SiteLandValuesExplanation, {
  type LandValuesExplanationProps,
} from "../../../modal-content/SiteLandValuesExplanation";

type Props = {
  currentValues: FormValues | undefined;
  defaultValues: FormValues | undefined;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  futureSiteOwnerName: string | undefined;
  landAndRealEstateValues?: LandValuesExplanationProps;
};

export type FormValues = {
  sellingPrice: number | undefined;
  propertyTransferDuties: number | undefined;
};

const EMPTY_VALUES = {
  sellingPrice: undefined,
  propertyTransferDuties: undefined,
};

const SitePurchaseAmountsForm = ({
  currentValues,
  defaultValues,
  onSubmit,
  onBack,
  futureSiteOwnerName,
  landAndRealEstateValues,
}: Props) => {
  const { handleSubmit, watch, setValue, control, formState, reset } = useForm<FormValues>({
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
    <WizardFormLayout
      title={
        <span className="flex flex-col">
          Montant de l'acquisition foncière{" "}
          <span className="text-base mt-1.5 font-normal">
            à la charge de <strong>{futureSiteOwnerName ?? "l'acquéreur"}</strong>
          </span>
        </span>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {defaultValues?.sellingPrice ? (
          <DefaultValueSwitch
            ModalContent={
              landAndRealEstateValues && <SiteLandValuesExplanation {...landAndRealEstateValues} />
            }
            defaultChecked={sellingPrice === defaultValues.sellingPrice}
            badge={<>Valeur estimée: {formatMoney(defaultValues.sellingPrice)}</>}
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
                Nous n'avons pas pu trouver de données pertinentes pour estimer le prix d'achat du
                site. Vous pouvez saisir les montants manuellement si vous les connaissez, ou passer
                cette étape.
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
