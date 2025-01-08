import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";

const TimeTravelSavedDescription = () => {
  return (
    <>
      <ModalHeader
        title="⏱ Temps de déplacement économisé"
        breadcrumbSegments={[
          {
            label: "Impacts sociaux",
            id: "social",
          },
          { label: "Temps de déplacement économisé" },
        ]}
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
