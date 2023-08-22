import { useContext, useMemo } from "react";

import { Button } from "@codegouvfr/react-dsfr/Button";
import { routes } from "@/router";
import { FormDataContext } from "../StateProvider";

function SiteFoncierCreationConfirmation() {
  const { kind } = useContext(FormDataContext);
  const previous = useMemo(
    () => (kind === "friche" ? "espaces.surfaces" : "type"),
    [kind],
  );

  return (
    <>
      <h2>Le site a été créé ! </h2>
      <Button
        priority="secondary"
        linkProps={routes.siteFoncierForm({ question: previous }).link}
      >
        Retour
      </Button>
    </>
  );
}

export default SiteFoncierCreationConfirmation;
