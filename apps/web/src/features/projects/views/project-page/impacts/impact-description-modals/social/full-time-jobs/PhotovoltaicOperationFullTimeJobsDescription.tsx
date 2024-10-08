import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import ModalTitleThree from "../../shared/ModalTitleThree";
import ModalTitleTwo from "../../shared/ModalTitleTwo";

type Props = {
  electricalPowerKWc?: number;
};

const PhotovoltaicOperationFullTimeJobsDescription = ({ electricalPowerKWc }: Props) => {
  return (
    <>
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
        Les données du projet peuvent avoir été saisies par l’utilisateur·ice ou avoir été suggérées
        par Bénéfriches sur la base d’une moyenne ou d’une hypothèse.
      </p>
      <ul>
        <li>
          Puissance installée (exprimée en MWc) :{" "}
          {electricalPowerKWc ? formatNumberFr(electricalPowerKWc / 1000) : "Inconnu"}
        </li>
      </ul>
      <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
      <p>
        Le nombre d’ETP est calculé en multipliant la valeur de puissance installée (exprimée en MW)
        par le ratio “Nombre d'emplois mobilisés pour l’exploitation (entretien et maintenance) par
        MW de puissance installée des panneaux photovoltaïques”.
      </p>

      <ModalTitleTwo>Sources</ModalTitleTwo>
      <ul>
        <li>
          <ExternalLink href="https://www.ilo.org/wcmsp5/groups/public/---dgreports/---dcomm/documents/publication/wcms_856649.pdf">
            Exploitation (entretien et maintenance) des panneaux photovoltaïques
          </ExternalLink>
        </li>
      </ul>
    </>
  );
};

export default PhotovoltaicOperationFullTimeJobsDescription;
