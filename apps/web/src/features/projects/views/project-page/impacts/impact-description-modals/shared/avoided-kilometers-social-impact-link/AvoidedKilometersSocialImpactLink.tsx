import Button from "@codegouvfr/react-dsfr/Button";
import { useContext } from "react";

import { ImpactModalDescriptionContext } from "../../ImpactModalDescriptionContext";

const LinkToAvoidedKilometersImpact = () => {
  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  return (
    <Button
      onClick={() => {
        openImpactModalDescription({
          sectionName: "social",
          impactName: "avoided_vehicule_kilometers",
        });
      }}
      className="tw-px-1"
      priority="tertiary no outline"
    >
      «&nbsp;🚙 Kilomètres évités&nbsp;»
    </Button>
  );
};

export default LinkToAvoidedKilometersImpact;
