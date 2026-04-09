import { useController, useForm } from "react-hook-form";
import { Address, SiteNature } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SearchAddressAutocomplete from "@/shared/views/components/form/Address/SearchAddressAutocompleteContainer";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  selectedAddress?: Address;
  onSubmit: (address: Address) => void;
  onBack: () => void;
  siteNature: SiteNature | undefined;
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
    rules: { required: "L'adresse est nécessaire pour les étapes suivantes" },
  });

  const title = getTitle(siteNature);

  return (
    <WizardFormLayout title={title}>
      <form
        onSubmit={handleSubmit((formData: FormValues) => {
          onSubmit(formData.selectedAddress!);
        })}
      >
        <SearchAddressAutocomplete
          selectedAddress={field.value}
          onSelectedAddressChange={field.onChange}
          searchInputProps={{
            label: <RequiredLabel label="Adresse" />,
            state: fieldState.error ? "error" : "default",
            hintText: "Entrez le nom de la commune, le code postal ou l'adresse complète",
            nativeInputProps: {
              placeholder: "Montrouge, 92120 etc.",
            },
            stateRelatedMessage: fieldState.error?.message,
          }}
        />
        <div className="mt-4">
          <BackNextButtonsGroup onBack={onBack} disabled={!field.value} nextLabel="Valider" />
        </div>
      </form>
    </WizardFormLayout>
  );
}

export default SiteAddressForm;
