import Button from "@codegouvfr/react-dsfr/Button";
import { useContext } from "react";

import { SocialImpactDetailsName } from "@/features/projects/domain/projectImpactsSocial";
import { formatETPImpact } from "@/features/projects/views/shared/formatImpactValue";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { getFullTimeJobsDetailsColor } from "../../../getImpactColor";
import { ModalDataProps } from "../../ImpactModalDescription";
import { ImpactModalDescriptionContext } from "../../ImpactModalDescriptionContext";
import ModalBody from "../../shared/ModalBody";
import ModalContent from "../../shared/ModalContent";
import ModalData from "../../shared/ModalData";
import ModalGrid from "../../shared/ModalGrid";
import ModalHeader from "../../shared/ModalHeader";
import ModalTable from "../../shared/ModalTable";
import ModalTitleTwo from "../../shared/ModalTitleTwo";
import ModalAreaChart from "../../shared/modal-charts/ModalAreaChart";
import { mainBreadcrumbSection, jobsBreadcrumbSection } from "../breadcrumbSections";

type Props = {
  impactData: ModalDataProps["impactsData"]["social"]["fullTimeJobs"];
};

const FullTimeJobsDescription = ({ impactData }: Props) => {
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const data = (
    impactData
      ? [
          {
            ...impactData.operations,
            label: "Exploitation du site",
            color: getFullTimeJobsDetailsColor("operations_full_time_jobs"),
            name: "operations_full_time_jobs" as SocialImpactDetailsName,
          },
          {
            ...impactData.conversion,
            label: "Reconversion du site",
            color: getFullTimeJobsDetailsColor("conversion_full_time_jobs"),
            name: "conversion_full_time_jobs" as SocialImpactDetailsName,
          },
        ]
      : []
  ).filter(({ difference }) => difference !== 0);

  return (
    <ModalBody size="large">
      <ModalHeader
        title="🧑‍🔧 Emplois équivalent temps plein"
        breadcrumbSegments={[
          mainBreadcrumbSection,
          jobsBreadcrumbSection,
          { label: "Emplois équivalent temps plein" },
        ]}
      />
      <ModalGrid>
        <ModalData>
          <ModalAreaChart
            type="etp"
            base={impactData?.base ?? 0}
            forecast={impactData?.forecast ?? 0}
            difference={impactData?.difference ?? 0}
            title="🧑‍🔧 Emplois équivalent temps plein"
            details={data}
          />

          <ModalTable
            formatFn={formatETPImpact}
            caption="Détails des emplois temps-plein"
            data={data.map(({ label, difference, color, name }) => ({
              label,
              value: difference,
              color,
              onClick: () => {
                updateModalContent({
                  sectionName: "social",
                  impactName: "full_time_jobs",
                  impactDetailsName: name,
                });
              },
            }))}
          />
        </ModalData>

        <ModalContent>
          <p>
            La concrétisation du projet implique généralement une activité économique qui va
            impliquer des emplois (pour des études et/ou des travaux) : pour la remise en état du
            site (déconstruction, dépollution, etc.) et pour la réalisation du projet (ex : emploi
            dans le secteur de la construction ou du solaire photovoltaïque). Il s’agit des emplois
            mobilisés pendant la durée de la reconversion.
          </p>
          <p>
            Ces emplois sont exprimés en “équivalent temps plein”, une unité de mesure
            proportionnelle au nombre d'heures travaillées par un salarié. Il est calculé à partir
            de la durée mensuelle légale de travail, égale à 151,67 heures par mois.
          </p>
          Exemples :
          <ul>
            <li>1 salarié à mi-temps sur 12 mois = 0,5 ETP</li>
            <li>1 salarié à temps plein sur 12 mois = 1 ETP</li>
          </ul>
          <div className="tw-flex tw-flex-col">
            <Button
              onClick={() => {
                updateModalContent({
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
                updateModalContent({
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
      </ModalGrid>
    </ModalBody>
  );
};

export default FullTimeJobsDescription;
