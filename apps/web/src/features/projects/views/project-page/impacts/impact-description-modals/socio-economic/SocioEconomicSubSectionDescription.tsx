import { ReactNode, useContext } from "react";
import { sumListWithKey } from "shared";

import { SocioEconomicImpactByCategory } from "@/features/projects/domain/projectImpactsSocioEconomic";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { getActorLabel } from "@/features/projects/views/shared/socioEconomicLabels";

import { getSocioEconomicImpactColor } from "../../getImpactColor";
import { getSocioEconomicImpactLabel } from "../../getImpactLabel";
import ImpactActorsItem from "../../list-view/ImpactActorsItem";
import {
  ImpactModalDescriptionContext,
  SocioEconomicSubSectionName,
} from "../ImpactModalDescriptionContext";
import ModalBarColoredChart from "../shared/ModalBarColoredChart";
import ModalBody from "../shared/ModalBody";
import ModalContent from "../shared/ModalContent";
import ModalData from "../shared/ModalData";
import ModalGrid from "../shared/ModalGrid";
import ModalHeader from "../shared/ModalHeader";
import { mainBreadcrumbSection } from "./breadcrumbSections";

type Props = {
  impactsData: SocioEconomicImpactByCategory;
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
  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  const { impacts, total } = impactsData;

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
          <ModalBarColoredChart
            data={impacts.map(({ actors, name }) => ({
              label: getSocioEconomicImpactLabel(name),
              color: getSocioEconomicImpactColor(name),
              value: sumListWithKey(actors, "value"),
            }))}
          />

          {impacts.map(({ name, actors }) => (
            <ImpactActorsItem
              key={name}
              label={getSocioEconomicImpactLabel(name)}
              actors={actors.map(
                ({ name: actorLabel, value: actorValue, details: actorDetails }) => ({
                  label: getActorLabel(actorLabel),
                  value: actorValue,
                  details: actorDetails
                    ? actorDetails.map(({ name: detailsName, value: detailsValue }) => ({
                        label: getSocioEconomicImpactLabel(detailsName),
                        value: detailsValue,
                        onClick: () => {
                          openImpactModalDescription({
                            sectionName: "socio_economic",
                            subSectionName,
                            impactName: name,
                            impactDetailsName: detailsName,
                          });
                        },
                      }))
                    : undefined,
                }),
              )}
              onClick={() => {
                openImpactModalDescription({
                  sectionName: "socio_economic",
                  subSectionName,
                  impactName: name,
                });
              }}
              type="monetary"
            />
          ))}
        </ModalData>

        <ModalContent>
          Les impacts socio-économiques consistent en 4 catégories :
          <ul>
            <li>les impacts économiques directs</li>
            <li>les impacts économiques indirects</li>
            <li>les impacts sociaux monétarisés</li>
            <li>les impacts environnementaux monétarisés</li>
          </ul>
          {children}
        </ModalContent>
      </ModalGrid>
    </ModalBody>
  );
};

export default SocioEconomicSubSectionDescription;
