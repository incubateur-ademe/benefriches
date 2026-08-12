import Button from "@codegouvfr/react-dsfr/Button";
import { useContext } from "react";
import { sumListWithKey } from "shared";

import { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import { formatETPImpact } from "@/features/projects/views/shared/formatImpactValue";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalData from "@/features/projects/views/shared/impacts/modals/ModalData";
import ModalGrid from "@/features/projects/views/shared/impacts/modals/ModalGrid";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import ModalTitleTwo from "@/features/projects/views/shared/impacts/modals/ModalTitleTwo";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import ModalTable from "../shared/ModalTable";
import ModalAreaChart from "../shared/modal-charts/ModalAreaChart";

type Props = {
  impactsData: ModalDataProps["impactsData"];
  contextData: ModalDataProps["contextData"];
};

const FullTimeJobsDescription = ({ impactsData, contextData }: Props) => {
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const operationsFullTimeJobsKeyName =
    contextData.projectDevelopmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
      ? ("fullTimeJobs.photovoltaicOperationsFullTimeJobs" as const)
      : ("fullTimeJobs.urbanOperationsFullTimeJobs" as const);

  const data = [
    {
      base: 0,
      forecast: sumListWithKey(
        impactsData.reconversionImpactsBreakdown.projectIndirectImpactMetrics.filter(
          (item) =>
            item.name === "conversionFullTimeJobs" || item.name === "reinstatementFullTimeJobs",
        ),
        "total",
      ),
      difference: sumListWithKey(
        impactsData.aggregatedReconversionImpacts.impactsMetrics.filter(
          (item) =>
            item.name === "conversionFullTimeJobs" || item.name === "reinstatementFullTimeJobs",
        ),
        "total",
      ),
      label: "Reconversion du site",
      color: "#E73518",
      name: "fullTimeJobs.conversionFullTimeJobs" as const,
    },
    {
      label: "Exploitation du site",
      name: operationsFullTimeJobsKeyName,
      base:
        impactsData.reconversionImpactsBreakdown.siteStatuQuoImpactMetrics.find(
          (item) => item.name === "operationsFullTimeJobs",
        )?.total ?? 0,
      forecast:
        impactsData.reconversionImpactsBreakdown.projectIndirectImpactMetrics.find(
          (item) => item.name === "operationsFullTimeJobs",
        )?.total ?? 0,
      difference:
        impactsData.aggregatedReconversionImpacts.impactsMetrics.find(
          (item) => item.name === "operationsFullTimeJobs",
        )?.total ?? 0,
      color: "#C4C5C6",
    },
  ].filter((item) => item.difference !== 0);

  return (
    <ModalBody size="large">
      <ModalHeader
        title="🧑‍🔧 Emplois équivalent temps plein"
        breadcrumbSegments={[
          { label: "Impacts sociaux", contentState: { sectionName: "social" } },
          {
            label: "Impacts sur l'emploi",
            contentState: { sectionName: "social", subSectionName: "jobs" },
          },
          { label: "Emplois équivalent temps plein" },
        ]}
      />
      <ModalGrid>
        <ModalData>
          <ModalAreaChart
            type="etp"
            base={sumListWithKey(data, "base")}
            forecast={sumListWithKey(data, "forecast")}
            difference={sumListWithKey(data, "difference")}
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
                  impactName: "fullTimeJobs",
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
          <div className="flex flex-col">
            <Button
              onClick={() => {
                updateModalContent({
                  sectionName: "social",
                  impactName: "fullTimeJobs",
                  impactDetailsName: "fullTimeJobs.conversionFullTimeJobs",
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
                  impactName: "fullTimeJobs",
                  impactDetailsName: operationsFullTimeJobsKeyName,
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
