import Button from "@codegouvfr/react-dsfr/Button";
import { useContext } from "react";

import { ImpactModalDescriptionContext } from "../../ImpactModalDescriptionContext";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import { breadcrumbSection } from "../breadcrumbSection";

const PermeableSurfaceDescription = () => {
  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);
  return (
    <>
      <ModalHeader
        title="🌧 Surface perméable"
        breadcrumbSegments={[breadcrumbSection, { label: "Surface perméable" }]}
      />
      <ModalContent>
        <p>
          Il s'agit de la surface qui n'est pas imperméabilisée et permet ainsi l'infiltration de
          l'eau de pluie sur la parcelle. La surface perméable peut être{" "}
          <Button
            onClick={() => {
              openImpactModalDescription({
                sectionName: "environmental",
                impactName: "permeable_surface_area",
                impactDetailsName: "mineral_soil",
              });
            }}
            priority="tertiary no outline"
          >
            🪨 minérale
          </Button>{" "}
          ou{" "}
          <Button
            onClick={() => {
              openImpactModalDescription({
                sectionName: "environmental",
                impactName: "permeable_surface_area",
                impactDetailsName: "green_soil",
              });
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
      </ModalContent>
    </>
  );
};

export default PermeableSurfaceDescription;
