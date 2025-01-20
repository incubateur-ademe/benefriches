import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import { mainBreadcrumbSection, localPeopleBreadcrumbSection } from "../breadcrumbSections";

const TITLE = "Temps passé en moins dans les transports";

const TimeTravelSavedDescription = () => {
  return (
    <>
      <ModalHeader
        title={`⏱ ${TITLE}`}
        subtitle="Grâce à la ou les commodités créées dans le quartier"
        breadcrumbSegments={[mainBreadcrumbSection, localPeopleBreadcrumbSection, { label: TITLE }]}
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
