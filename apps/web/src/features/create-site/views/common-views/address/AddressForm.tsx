import { useController, useForm } from "react-hook-form";
import { Address, SiteNature } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SearchAddressAutocomplete from "@/shared/views/components/form/Address/SearchAddressAutocompleteContainer";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
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
    <WizardFormLayout
      title={title}
      instructions={
        <FormInfo>
          <p>
            Si vous ne connaissez pas l'adresse exacte, entrez simplement le nom de la commune ou
            son code postal.
          </p>
          <p className="text-sm m-0">
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
