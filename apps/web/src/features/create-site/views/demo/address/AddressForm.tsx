import { useController, useForm } from "react-hook-form";
import { Address, SiteNature } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SearchAddressAutocompleteContainer from "@/shared/views/components/form/Address/SearchAddressAutocompleteContainer";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (address: Address) => void;
  onBack: () => void;
  siteNature: SiteNature | undefined;
  selectedAddress?: Address;
};

type FormValues = {
  selectedAddress?: Address;
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

function SiteAddressForm({ selectedAddress: initialAddress, onSubmit, siteNature, onBack }: Props) {
  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: { selectedAddress: initialAddress },
  });

  const { field, fieldState } = useController({
    name: "selectedAddress",
    control,
    rules: {
      required:
        "La commune est utilisée par Bénéfriches pour calculer les impacts à partir de données locales.",
    },
  });

  const title = getTitle(siteNature);

  return (
    <WizardFormLayout title={title}>
      <form
        onSubmit={handleSubmit((formData: FormValues) => {
          onSubmit(formData.selectedAddress!);
        })}
      >
        <SearchAddressAutocompleteContainer
          addressType="municipality"
          selectedAddress={field.value}
          onSelectedAddressChange={field.onChange}
          searchInputProps={{
            label: <RequiredLabel label="Commune ou code postal" />,
            state: fieldState.error ? "error" : "default",
            stateRelatedMessage: fieldState.error?.message,
          }}
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!field.value} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default SiteAddressForm;
