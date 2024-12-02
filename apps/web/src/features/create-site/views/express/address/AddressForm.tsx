import { Controller, useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SearchAddressAutocompleteContainer from "@/shared/views/components/form/Address/SearchAddressAutocompleteContainer";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import { MunicipalityAddress } from "../../../domain/siteFoncier.types";

type Props = {
  onSubmit: (address: MunicipalityAddress) => void;
  onBack: () => void;
  isFriche: boolean;
  initialValues: Partial<FormValues>;
};

type FormValues = {
  selectedAddress?: MunicipalityAddress;
  searchText: string;
};

function SiteAddressForm({ initialValues, onSubmit, isFriche, onBack }: Props) {
  const { handleSubmit, formState, control, watch, setValue, register } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const error = formState.errors.selectedAddress;

  const title = isFriche ? "Où est située cette friche ?" : "Où est situé ce site ?";

  register("selectedAddress", {
    required:
      "La commune est utilisée par Bénéfriches pour calculer les impacts à partir de données locales.",
  });

  const selectedAddress = watch("selectedAddress");

  return (
    <>
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
                  setValue("selectedAddress", v as MunicipalityAddress);
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
    </>
  );
}

export default SiteAddressForm;
