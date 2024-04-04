import Alert from "@codegouvfr/react-dsfr/Alert";
import { Select, SelectProps } from "@codegouvfr/react-dsfr/SelectNext";
import { LOCAL_AUTHORITY_AVAILABLE_VALUES } from "./values";

import { LocalAutorityStructureType } from "@/shared/domain/stakeholder";
import formatLocalAuthorityName from "@/shared/services/strings/formatLocalAuthorityName";

type DataProps = {
  loadingData: "success" | "idle" | "error" | "loading";
  data?: {
    city: {
      code: string;
      name: string;
    };
    epci?: {
      code: string;
      name: string;
    };
    department: {
      code: string;
      name: string;
    };
    region: {
      code: string;
      name: string;
    };
  };
  excludedValues?: string[];
};

type Props = DataProps & Omit<SelectProps<SelectProps.Option[]>, "options">;

const LocalAuthoritySelect = (props: Props) => {
  const { loadingData, data, excludedValues: propsExcludedValues = [], ...rest } = props;

  if (loadingData === "loading") {
    return "Chargement des données...";
  }

  if (loadingData === "error") {
    return (
      <Alert
        description="Une erreur s’est produite lors de la récupération des collectivités associées à votre site..."
        severity="error"
        title="Erreur"
        className="fr-my-7v"
      />
    );
  }

  if (loadingData !== "success" || !data) {
    return null;
  }

  const { epci } = data;

  const excludedValues = epci ? propsExcludedValues : ["epci", ...propsExcludedValues];

  const localAuthorities = LOCAL_AUTHORITY_AVAILABLE_VALUES.filter(
    (val) => !(epci ? excludedValues : ["epci", ...excludedValues]).includes(val),
  );

  const options = localAuthorities.map((value) => ({
    label: formatLocalAuthorityName(value as LocalAutorityStructureType, data),
    value,
  }));

  return <Select {...rest} options={options} />;
};

LocalAuthoritySelect.displayName = "LocalAuthoritySelect";

export default LocalAuthoritySelect;
