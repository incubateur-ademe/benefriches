import Button from "@codegouvfr/react-dsfr/Button";
import { useContext } from "react";

import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";

const LinkToAvoidedKilometersImpact = () => {
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  return (
    <Button
      onClick={() => {
        updateModalContent({
          sectionName: "social",
          subSectionName: "localPeopleOrCompany",
          impactName: "avoidedVehiculeKilometers",
        });
      }}
      className="px-1"
      priority="tertiary no outline"
    >
      «&nbsp;🚙 Kilomètres évités&nbsp;»
    </Button>
  );
};

export default LinkToAvoidedKilometersImpact;
