import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";

const PermeableGreenSurfaceDescription = () => {
  return (
    <>
      <ModalHeader
        title="☘️ Surface végétalisée"
        breadcrumbSegments={[
          {
            label: "Impacts environnementaux",
            id: "environmental",
          },
          {
            label: "Surface perméable",
            id: "environmental.permeable-surface",
          },
          { label: "Surface végétalisée" },
        ]}
      />
      <ModalContent>
        <p>
          Il s'agit de la surface non imperméabilisée dont le revêtement permet le développement de
          végétation (par opposition à la surface perméable minérale) : terre végétale, sol enherbé,
          arbustif ou arboré, prairie, culture, vergers, vignes, forêt, technosols.
        </p>
        <p>
          La valeur est la somme des surfaces détaillées ci-dessus, qui ont été renseignées par
          l'utilisateur, pour le site et pour le projet.
        </p>
      </ModalContent>
    </>
  );
};

export default PermeableGreenSurfaceDescription;
