import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import { breadcrumbSection } from "../breadcrumbSection";

const TimeTravelSavedDescription = () => {
  return (
    <>
      <ModalHeader
        title="⏱ Temps de déplacement économisé"
        breadcrumbSegments={[breadcrumbSection, { label: "Temps de déplacement économisé" }]}
      />
      <ModalContent>
        <p>
          Il s’agit du nombre d’heures totales qui ne seront pas passées dans les transports par les
          personnes impactées par le projet.
        </p>
      </ModalContent>
    </>
  );
};

export default TimeTravelSavedDescription;
