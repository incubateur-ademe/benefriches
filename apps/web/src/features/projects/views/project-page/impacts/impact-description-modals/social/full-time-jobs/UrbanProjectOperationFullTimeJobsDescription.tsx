import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import ModalTitleThree from "../../shared/ModalTitleThree";
import ModalTitleTwo from "../../shared/ModalTitleTwo";

type Props = {
  groundFloorRetailSurface: number;
};

const UrbanProjectOperationFullTimeJobsDescription = ({ groundFloorRetailSurface }: Props) => {
  return (
    <>
      <ModalHeader
        title="🧑‍🔧 Exploitation du site"
        breadcrumbSegments={[
          {
            label: "Impacts sociaux",
            id: "social",
          },
          {
            label: "Emplois équivalent temps plein",
            id: "social.full-time-jobs",
          },
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
            Nombre d'emplois mobilisés par m² de surface de commerces de proximité créés : 0.044
          </li>
        </ul>
        <ModalTitleThree> Données du projet</ModalTitleThree>
        <p>
          Les données du projet peuvent avoir été saisies par l’utilisateur·ice ou avoir été
          suggérées par Bénéfriches sur la base d’une moyenne ou d’une hypothèse.
        </p>
        <ul>
          <li>Surface de commerce créés : {formatSurfaceArea(groundFloorRetailSurface)}</li>
        </ul>
        <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
        <p>
          Le nombre d’ETP est calculé en multipliant la valeur de surface de commerce de proximité
          créés (exprimée en m²) par le ratio “Nombre d'emplois mobilisés par m² de surface de
          commerces de proximité”.
        </p>

        <ModalTitleTwo>Sources</ModalTitleTwo>
        <ul>
          <li>
            <ExternalLink href="https://www.assemblee-nationale.fr/dyn/15/rapports/cion-dvp/l15b4968_rapport-information#">
              Assemblée nationale : Rapport d'information n°4968
            </ExternalLink>
          </li>
        </ul>
      </ModalContent>
    </>
  );
};

export default UrbanProjectOperationFullTimeJobsDescription;
