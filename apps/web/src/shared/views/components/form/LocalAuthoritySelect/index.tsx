import { forwardRef } from "react";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { Select, SelectProps } from "@codegouvfr/react-dsfr/SelectNext";

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
};

type Props = DataProps & Omit<SelectProps<SelectProps.Option[]>, "options">;

const LocalAuthoritySelect = forwardRef<HTMLDivElement, Props>((props: Props) => {
  const { loadingData, data, ...rest } = props;

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

  const localAuthorities = ["municipality", "department", "region"];

  if (epci) {
    localAuthorities.splice(1, 0, "epci");
  }

  const options = localAuthorities.map((value) => ({
    label: formatLocalAuthorityName(value as LocalAutorityStructureType, data),
    value,
  }));

  return <Select {...rest} options={options} />;
});

LocalAuthoritySelect.displayName = "LocalAuthoritySelect";

export default LocalAuthoritySelect;
