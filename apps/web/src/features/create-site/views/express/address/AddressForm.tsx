import { Controller, useForm } from "react-hook-form";
import { Address, SiteNature } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SearchAddressAutocompleteContainer from "@/shared/views/components/form/Address/SearchAddressAutocompleteContainer";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (address: Address) => void;
  onBack: () => void;
  siteNature: SiteNature | undefined;
  initialValues: Partial<FormValues>;
};

type FormValues = {
  selectedAddress?: Address;
  searchText: string;
};

const getTitle = (siteNature: SiteNature | undefined) => {
  switch (siteNature) {
    case "FRICHE":
      return `Où est située la friche ?`;
    case "AGRICULTURAL_OPERATION":
      return `Où est située l'exploitation agricole ?`;
    case "NATURAL_AREA":
      return `Où est situé l'espace naturel ?`;
    default:
      return `Où est situé le site ?`;
  }
};

function SiteAddressForm({ initialValues, onSubmit, siteNature, onBack }: Props) {
  const { handleSubmit, formState, control, watch, setValue, register } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const error = formState.errors.selectedAddress;

  const title = getTitle(siteNature);

  register("selectedAddress", {
    required:
      "La commune est utilisée par Bénéfriches pour calculer les impacts à partir de données locales.",
  });

  const selectedAddress = watch("selectedAddress");

  return (
    <WizardFormLayout title={title}>
      <form
        onSubmit={handleSubmit((formData: FormValues) => {
          onSubmit(formData.selectedAddress!);
        })}
      >
        <Controller
          control={control}
          name="searchText"
          render={({ field }) => (
            <SearchAddressAutocompleteContainer
              addressType="municipality"
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
                label: <RequiredLabel label="Commune ou code postal" />,
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
