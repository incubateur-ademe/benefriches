import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import ModalTitleThree from "@/features/projects/views/shared/impacts/modals/ModalTitleThree";
import ModalTitleTwo from "@/features/projects/views/shared/impacts/modals/ModalTitleTwo";
import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { breadcrumbSegments } from "./breadcrumbSegments";

type Props = {
  electricalPowerKWc?: number;
};

const PhotovoltaicOperationFullTimeJobsDescription = ({ electricalPowerKWc }: Props) => {
  return (
    <ModalBody>
      <ModalHeader
        title="🧑‍🔧 Exploitation du site"
        breadcrumbSegments={[
          ...breadcrumbSegments,
          { label: "Mobilisés pour l’exploitation du site" },
        ]}
      />
      <ModalContent>
        <p>
          Il s’agit des emplois mobilisés pendant la durée d’exploitation du projet (étude et
          travaux). Ils sont exprimés en “équivalent temps pleins”.
        </p>
        <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
        <ModalTitleThree>Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
        <ul>
          <li>
            Nombre d'emplois mobilisés pour l’exploitation (entretien et maintenance) par MW de
            puissance installée des panneaux photovoltaïques : 0.2
          </li>
        </ul>
        <ModalTitleThree> Données du projet</ModalTitleThree>
        <p>
          Les données du projet peuvent avoir été saisies par l’utilisateur·ice ou avoir été
          suggérées par Bénéfriches sur la base d’une moyenne ou d’une hypothèse.
        </p>
        <ul>
          <li>
            Puissance installée (exprimée en MWc) :{" "}
            {electricalPowerKWc ? formatNumberFr(electricalPowerKWc / 1000) : "Inconnu"}
          </li>
        </ul>
        <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
        <p>
          Le nombre d’ETP est calculé en multipliant la valeur de puissance installée (exprimée en
          MW) par le ratio “Nombre d'emplois mobilisés pour l’exploitation (entretien et
          maintenance) par MW de puissance installée des panneaux photovoltaïques”.
        </p>

        <ModalTitleTwo>Sources</ModalTitleTwo>
        <ul>
          <li>
            <ExternalLink href="https://www.ilo.org/wcmsp5/groups/public/---dgreports/---dcomm/documents/publication/wcms_856649.pdf">
              Exploitation (entretien et maintenance) des panneaux photovoltaïques
            </ExternalLink>
          </li>
        </ul>
      </ModalContent>
    </ModalBody>
  );
};

export default PhotovoltaicOperationFullTimeJobsDescription;
