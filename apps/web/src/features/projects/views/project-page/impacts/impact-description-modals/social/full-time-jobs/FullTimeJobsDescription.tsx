import Button from "@codegouvfr/react-dsfr/Button";
import { useContext } from "react";

import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { ImpactModalDescriptionContext } from "../../ImpactModalDescriptionContext";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import ModalTitleTwo from "../../shared/ModalTitleTwo";
import { mainBreadcrumbSection, jobsBreadcrumbSection } from "../breadcrumbSections";

const FullTimeJobsDescription = () => {
  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  return (
    <>
      <ModalHeader
        title="🧑‍🔧 Emplois équivalent temps plein"
        breadcrumbSegments={[
          mainBreadcrumbSection,
          jobsBreadcrumbSection,
          { label: "Emplois équivalent temps plein" },
        ]}
      />
      <ModalContent>
        <p>
          La concrétisation du projet implique généralement une activité économique qui va impliquer
          des emplois (pour des études et/ou des travaux) : pour la remise en état du site
          (déconstruction, dépollution, etc.) et pour la réalisation du projet (ex : emploi dans le
          secteur de la construction ou du solaire photovoltaïque). Il s’agit des emplois mobilisés
          pendant la durée de la reconversion.
        </p>
        <p>
          Ces emplois sont exprimés en “équivalent temps plein”, une unité de mesure proportionnelle
          au nombre d'heures travaillées par un salarié. Il est calculé à partir de la durée
          mensuelle légale de travail, égale à 151,67 heures par mois.
        </p>
        Exemples :
        <ul>
          <li>1 salarié à mi-temps sur 12 mois = 0,5 ETP</li>
          <li>1 salarié à temps plein sur 12 mois = 1 ETP</li>
        </ul>
        <div className="tw-flex tw-flex-col">
          <Button
            onClick={() => {
              openImpactModalDescription({
                sectionName: "social",
                impactName: "full_time_jobs",
                impactDetailsName: "conversion_full_time_jobs",
              });
            }}
            priority="tertiary no outline"
          >
            👷 Reconversion du site
          </Button>{" "}
          <Button
            onClick={() => {
              openImpactModalDescription({
                sectionName: "social",
                impactName: "full_time_jobs",
                impactDetailsName: "operations_full_time_jobs",
              });
            }}
            priority="tertiary no outline"
          >
            🧑‍🔧 Exploitation du site
          </Button>
        </div>
        <ModalTitleTwo>Sources</ModalTitleTwo>
        <ExternalLink href="https://entreprendre.service-public.fr/vosdroits/F24332">
          Comment calculer les effectifs d'une entreprise ?
        </ExternalLink>
      </ModalContent>
    </>
  );
};

export default FullTimeJobsDescription;
