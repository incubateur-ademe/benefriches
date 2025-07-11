import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

import { mainBreadcrumbSection } from "./breadcrumbSections";

const JobsSubSectionDescription = () => {
  return (
    <ModalBody>
      <ModalHeader
        title="Impacts sur l'emploi"
        breadcrumbSegments={[mainBreadcrumbSection, { label: "Impacts sur l'emploi" }]}
      />
      <ModalContent>
        <p>
          La concrétisation du projet nécessite généralement une activité économique qui va
          impliquer des emplois, au minimum de manière transitoire pour la remise en état du site
          (déconstruction, dépollution, etc.) et pour les étapes d’aménagement et/ou de
          construction.
        </p>
        <p>
          Ensuite, en cas de finalité économique du projet (ex : services de proximité, bureaux,
          réindustrialisation), des emplois pourront être pérennisés (ex: déménagement d’entreprise)
          ou crées (ex : nouvelle implantation ou besoin d’entretien d’équipements notamment
          photovoltaïque).
        </p>
      </ModalContent>
    </ModalBody>
  );
};

export default JobsSubSectionDescription;
