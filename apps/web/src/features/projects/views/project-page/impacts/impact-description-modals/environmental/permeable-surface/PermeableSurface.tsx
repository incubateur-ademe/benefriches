import Button from "@codegouvfr/react-dsfr/Button";
import { useContext } from "react";

import { ImpactModalDescriptionContext } from "../../ImpactModalDescriptionContext";
import ModalHeader from "../../shared/ModalHeader";

const PermeableSurfaceDescription = () => {
  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);
  return (
    <>
      <ModalHeader
        title="🌧 Surface perméable"
        breadcrumbSegments={[
          {
            label: "Impacts environnementaux",
            id: "environmental",
          },
          { label: "Surface perméable" },
        ]}
      />
      <p>
        Il s'agit de la surface qui n'est pas imperméabilisée et permet ainsi l'infiltration de
        l'eau de pluie sur la parcelle. La surface perméable peut être{" "}
        <Button
          onClick={() => {
            openImpactModalDescription("environmental.minerale-surface");
          }}
          priority="tertiary no outline"
        >
          🪨 minérale
        </Button>{" "}
        ou{" "}
        <Button
          onClick={() => {
            openImpactModalDescription("environmental.green-surface");
          }}
          priority="tertiary no outline"
        >
          ☘️ végétalisée
        </Button>
        .
      </p>
      <p>
        La valeur est la somme des surfaces détaillées ci-dessus, qui ont été renseignées par
        l'utilisateur, pour le site et pour le projet.
      </p>
    </>
  );
};

export default PermeableSurfaceDescription;
