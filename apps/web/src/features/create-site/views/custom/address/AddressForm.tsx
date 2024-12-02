import { Controller, useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SearchAddressAutocomplete from "@/shared/views/components/form/Address/SearchAddressAutocompleteContainer";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import { Address } from "../../../domain/siteFoncier.types";

type Props = {
  initialValues: FormValues;
  onSubmit: (address: Address) => void;
  onBack: () => void;
  isFriche: boolean;
};

type FormValues = {
  selectedAddress?: Address;
  searchText: string;
};

function SiteAddressForm({ initialValues, onSubmit, isFriche, onBack }: Props) {
  const { handleSubmit, formState, control, watch, setValue, register } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const error = formState.errors.selectedAddress;

  const title = isFriche ? "Où est située cette friche ?" : "Où est situé ce site ?";

  register("selectedAddress", {
    required: "L'adresse est nécessaire pour les étapes suivantes",
  });

  const selectedAddress = watch("selectedAddress");

  return (
    <WizardFormLayout
      title={title}
      instructions={
        <FormInfo>
          <p>
            Si vous ne connaissez pas l'adresse exacte, entrez simplement le nom de la commune ou
            son code postal.
          </p>
          <p className="tw-text-sm tw-m-0">
            L'adresse sert à positionner le site dans son environnement local, ce qui est utile
            pour&nbsp;:
          </p>
          <ul>
            <li>Connaître le type d'environnement (résidentiel, industriel, naturel, etc.)</li>
            <li>
              Déterminer des paramètres socio-économiques locaux (marché foncier et immobilier,
              densité de population, d'emplois, etc.)
            </li>
            <li>
              Identifier les éventuels services de proximité (loisirs, culturels, éducatifs, etc.)
            </li>
            <li>Identifier la proximité d'espaces naturels, agricoles ou forestiers</li>
            <li>
              Identifier la proximité de parcs urbains ou d'espaces de nature en ville Autant
              d'informations qui permettent à Bénéfriches de quantifier des indicateurs d'impacts
              socio-économiques.
            </li>
          </ul>
        </FormInfo>
      }
    >
      <form
        onSubmit={handleSubmit((formData: FormValues) => {
          onSubmit(formData.selectedAddress!);
        })}
      >
        <Controller
          control={control}
          name="searchText"
          render={({ field }) => (
            <SearchAddressAutocomplete
              searchInputValue={field.value}
              onSearchInputChange={(searchText: string) => {
                field.onChange(searchText);
                setValue("selectedAddress", undefined);
              }}
              selectedAddress={selectedAddress}
              onSelect={(v) => {
                setValue("selectedAddress", v);
                setValue("searchText", v.value);
              }}
              searchInputProps={{
                label: <RequiredLabel label="Adresse du site" />,
                state: error ? "error" : "default",
                stateRelatedMessage: error ? error.message : undefined,
              }}
            />
          )}
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!selectedAddress} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default SiteAddressForm;
