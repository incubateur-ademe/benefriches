import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import ModalTitleThree from "../../shared/ModalTitleThree";
import ModalTitleTwo from "../../shared/ModalTitleTwo";

type Props = {
  isPhotovoltaic: boolean;
};
const ReconversionFullTimeJobsDescription = ({ isPhotovoltaic }: Props) => {
  return (
    <>
      <p>
        Il s’agit des emplois mobilisés pendant la durée de la reconversion (étude et travaux). Ils
        sont exprimés en “équivalent temps pleins”.
      </p>
      <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
      <ModalTitleThree>Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
      <ul>
        <li>Nombre d'emplois mobilisés par M€ pour l’enlèvement de déchets</li>
        <li>Nombre d'emplois mobilisés par M€ pour la déconstruction/désamiantage</li>
        <li>Nombre d'emplois mobilisés par M€ la dépollution</li>
        <li>Nombre d'emplois mobilisés par M€ pour la désimperméabilisation</li>
        <li>Nombre d'emplois mobilisés par M€ pour la restauration écologique</li>
        {isPhotovoltaic && (
          <li>
            Nombre d'emplois mobilisés pour l’exploitation (entretien et maintenance) par MW de
            puissance installée des panneaux photovoltaïques
          </li>
        )}
      </ul>
      <ModalTitleThree> Données du projet</ModalTitleThree>
      <p>
        Les données du projet peuvent avoir été saisies par l’utilisateur·ice ou avoir été suggérées
        par Bénéfriches sur la base d’une moyenne ou d’une hypothèse.
      </p>
      <ul>
        <li>Dépenses d’enlèvement de déchets (exprimées en M€)</li>
        <li>Dépenses de déconstruction/désamiantage (exprimées en M€)</li>
        <li>Dépenses de dépollution (exprimées en M€)</li>
        <li>Dépenses de désimperméabilisation (exprimées en M€)</li>
        <li>Dépenses de restauration écologique (exprimées en M€)</li>
        {isPhotovoltaic && (
          <li>Dépenses d’installation de centrale photovoltaïque (exprimées en M€)</li>
        )}
      </ul>

      <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
      <p>
        Pour chaque poste de dépenses, le nombre d’ETP est calculé en multipliant le montant prévu
        au projet (exprimé en M€) par le ratio “Nombre d'emplois mobilisés par M€” pour le type de
        dépenses concerné.
      </p>

      <ModalTitleTwo>Sources</ModalTitleTwo>
      <ul>
        <li>
          <ExternalLink href="https://www.ordeec.org/fileadmin/user_upload/dechets-chiffres-cles-2023_si.pdf">
            Enlèvement de déchets
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://www.seddre.fr/">Déconstruction/désamiantage</ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://upds.org/qui-sommes-nous/">Dépollution</ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://www.fntp.fr/sites/default/files/data/recueil_statistiques_2021.pdf">
            Désimperméabilisation
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://www.genie-ecologique.fr/filiere-du-genie-ecologique/filiere/">
            Restauration écologique
          </ExternalLink>
        </li>
        {isPhotovoltaic && (
          <li>
            <ExternalLink href="https://www.ilo.org/wcmsp5/groups/public/---dgreports/---dcomm/documents/publication/wcms_856649.pdf">
              Installation de centrale photovoltaïque
            </ExternalLink>
          </li>
        )}
      </ul>
    </>
  );
};

export default ReconversionFullTimeJobsDescription;
