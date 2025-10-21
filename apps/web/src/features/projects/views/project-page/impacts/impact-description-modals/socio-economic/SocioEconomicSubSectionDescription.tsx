import Button from "@codegouvfr/react-dsfr/Button";
import { ReactNode, useContext } from "react";
import { SocioEconomicImpact, sumListWithKey } from "shared";

import { getSocioEconomicProjectImpactsByActor } from "@/features/projects/domain/projectImpactsSocioEconomic";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import {
  ImpactModalDescriptionContext,
  SocioEconomicSubSectionName,
} from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalData from "@/features/projects/views/shared/impacts/modals/ModalData";
import ModalGrid from "@/features/projects/views/shared/impacts/modals/ModalGrid";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import { getActorLabel } from "@/features/projects/views/shared/socioEconomicLabels";

import { getSocioEconomicImpactColor } from "../../getImpactColor";
import { getSocioEconomicImpactLabel } from "../../getImpactLabel";
import ModalTable from "../shared/ModalTable";
import ModalColumnSeriesChart from "../shared/modal-charts/ModalColumnSeriesChart";
import { mainBreadcrumbSection } from "./breadcrumbSections";

type Props = {
  impactsData: SocioEconomicImpact[];
  subSectionName: SocioEconomicSubSectionName;
  title: string;
  children: ReactNode;
  valueDescription?: string;
};

const SocioEconomicSubSectionDescription = ({
  impactsData,
  subSectionName,
  title,
  children,
  valueDescription = "répartis entre plusieurs bénéficiaires",
}: Props) => {
  const impactsByActor = getSocioEconomicProjectImpactsByActor(impactsData);
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const impactList = impactsByActor.map(({ name, impacts }) => ({
    label: getActorLabel(name),
    values: impacts.map(({ value, name }) => ({
      value,
      label: getSocioEconomicImpactLabel(name),
      color: getSocioEconomicImpactColor(name),
      name,
    })),
  }));

  const total = sumListWithKey(impactsData, "amount");

  return (
    <ModalBody size="large">
      <ModalHeader
        title={title}
        value={{
          state: total > 0 ? "success" : "error",
          text: formatMonetaryImpact(total),
          description: valueDescription,
        }}
        breadcrumbSegments={[mainBreadcrumbSection, { label: title }]}
      />
      <ModalGrid>
        <ModalData>
          <ModalColumnSeriesChart format="monetary" data={impactList} exportTitle={title} />

          <ModalTable
            caption="Liste des impacts socio-économiques"
            data={impactList.flatMap(({ label: actor, values }) =>
              values.map(({ value, label, name, color }) => ({
                label,
                color,
                value,
                actor,
                onClick: () => {
                  updateModalContent({
                    sectionName: "socio_economic",
                    subSectionName,
                    impactName: name,
                  });
                },
              })),
            )}
          />
        </ModalData>

        <ModalContent>
          Les impacts socio-économiques consistent en 4 catégories :
          <ul>
            <li>
              <Button
                className="px-1"
                priority="tertiary no outline"
                onClick={() => {
                  updateModalContent({
                    sectionName: "socio_economic",
                    subSectionName: "economic_direct",
                  });
                }}
              >
                💰 les impacts économiques directs
              </Button>
            </li>
            <li>
              <Button
                className="px-1"
                priority="tertiary no outline"
                onClick={() => {
                  updateModalContent({
                    sectionName: "socio_economic",
                    subSectionName: "economic_indirect",
                  });
                }}
              >
                🪙 les impacts économiques indirects
              </Button>
            </li>
            <li>
              <Button
                className="px-1"
                priority="tertiary no outline"
                onClick={() => {
                  updateModalContent({
                    sectionName: "socio_economic",
                    subSectionName: "social_monetary",
                  });
                }}
              >
                🚶 les impacts sociaux monétarisés
              </Button>
            </li>
            <li>
              <Button
                className="px-1"
                priority="tertiary no outline"
                onClick={() => {
                  updateModalContent({
                    sectionName: "socio_economic",
                    subSectionName: "environmental_monetary",
                  });
                }}
              >
                🌳 les impacts environnementaux monétarisés
              </Button>
            </li>
          </ul>
          {children}
        </ModalContent>
      </ModalGrid>
    </ModalBody>
  );
};

export default SocioEconomicSubSectionDescription;
