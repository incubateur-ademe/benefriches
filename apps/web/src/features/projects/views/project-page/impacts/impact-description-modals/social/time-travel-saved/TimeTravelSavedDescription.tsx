import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import { breadcrumbSection } from "../breadcrumbSection";

const TITLE = "Temps passé en moins dans les transports";

const TimeTravelSavedDescription = () => {
  return (
    <>
      <ModalHeader
        title={`⏱ ${TITLE}`}
        breadcrumbSegments={[breadcrumbSection, { label: TITLE }]}
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
