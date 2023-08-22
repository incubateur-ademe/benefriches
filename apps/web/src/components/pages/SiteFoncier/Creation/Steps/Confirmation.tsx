import { useContext, useMemo } from "react";

import { Button } from "@codegouvfr/react-dsfr/Button";
import { routes } from "@/router";
import { FormDataContext } from "../StateProvider";
import { SURFACE_KINDS } from "../../constants";
import { SiteFoncierPublicodesContext } from "../../PublicodesProvider";

function SiteFoncierCreationConfirmation() {
  const { kind, address, surfacesDistribution, surfaceKinds } =
    useContext(FormDataContext);

  const previous = useMemo(
    () => (kind === "friche" ? "espaces.surfaces" : "type"),
    [kind],
  );

  const { computeTotalSurface } = useContext(SiteFoncierPublicodesContext);

  return (
    <>
      <h2>Récapitulatif du site foncier</h2>

      <h3>
        {kind &&
          `${
            kind.charAt(0).toUpperCase() + kind.slice(1)
          } située l’adresse : ${address}`}
      </h3>
      <p>{address}</p>

      {surfaceKinds.map((key) => (
        <p>{`${SURFACE_KINDS[key].label} : ${surfacesDistribution[key]} m²`}</p>
      ))}

      <p>Total surface: {computeTotalSurface()} m²</p>

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
