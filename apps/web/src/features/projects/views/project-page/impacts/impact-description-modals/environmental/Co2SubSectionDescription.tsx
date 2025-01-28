import ModalBody from "../shared/ModalBody";
import ModalContent from "../shared/ModalContent";
import ModalHeader from "../shared/ModalHeader";
import { mainBreadcrumbSection } from "./breadcrumbSections";

const Co2SubSectionDescription = () => {
  return (
    <ModalBody>
      <ModalHeader
        title="Impacts sur le CO2-eq"
        breadcrumbSegments={[mainBreadcrumbSection, { label: "Impacts sur le CO2-eq" }]}
      />
      <ModalContent>
        <p>
          La réalisation du projet a des conséquences sur les émissions de CO2 pour plusieurs
          raisons, le cas échéant du fait : Dans ce dernier cas, il est possible de calculer une
          équivalence exprimée en nombre de foyers alimentés.
        </p>
        <ul>
          <li>
            du changement d’affectation des sols (ces derniers ayant une pouvoir de stockage de
            carbone variable selon leur type), par exemple via la désimperméabilisation puis
            renaturation,
          </li>
          <li>
            de la réduction des déplacements, par exemple par la création de fonctions urbaines en
            coeur de ville et non en périphérie,
          </li>
          <li>de la création de capacités de production d’énergies renouvelables. </li>
        </ul>
      </ModalContent>
    </ModalBody>
  );
};

export default Co2SubSectionDescription;
