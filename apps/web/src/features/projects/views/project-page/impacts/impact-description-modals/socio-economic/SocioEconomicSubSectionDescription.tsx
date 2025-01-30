import { ReactNode, useContext } from "react";
import { sumListWithKey } from "shared";

import {
  SocioEconomicImpactByCategory,
  SocioEconomicMainImpactName,
} from "@/features/projects/domain/projectImpactsSocioEconomic";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { getActorLabel } from "@/features/projects/views/shared/socioEconomicLabels";

import { getSocioEconomicImpactLabel } from "../../getImpactLabel";
import ImpactActorsItem from "../../list-view/ImpactActorsItem";
import {
  ImpactModalDescriptionContext,
  SocioEconomicSubSectionName,
} from "../ImpactModalDescriptionContext";
import ModalBarColoredChart from "../shared/ModalBarColoredChart";
import ModalBody from "../shared/ModalBody";
import ModalContent from "../shared/ModalContent";
import ModalHeader from "../shared/ModalHeader";
import { mainBreadcrumbSection } from "./breadcrumbSections";

type Props = {
  impactsData: SocioEconomicImpactByCategory;
  subSectionName: SocioEconomicSubSectionName;
  title: string;
  children: ReactNode;
  valueDescription?: string;
};

const getChartColor = (impactName: SocioEconomicMainImpactName) => {
  switch (impactName) {
    case "avoided_friche_costs":
      return "#9542F0";
    case "property_transfer_duties_income":
      return "#B342F0";
    case "rental_income":
      return "#9F13EB";
    case "roads_and_utilities_maintenance_expenses":
      return "#7A13EB";
    case "local_property_value_increase":
      return "#A0B4F8";
    case "local_transfer_duties_increase":
      return "#718FF4";
    case "taxes_income":
      return "#4269F0";
    case "avoided_car_related_expenses":
      return "#1243EB";
    case "avoided_air_conditioning_expenses":
      return "#103ACC";
    case "travel_time_saved":
      return "#71D6F4";
    case "avoided_traffic_accidents":
      return "#42C8F0";
    case "avoided_property_damages_expenses":
      return "#0D30AA";
    case "avoided_air_pollution":
      return "#7A13EB";
    case "avoided_co2_eq_emissions":
      return "#14EA81";
    case "ecosystem_services":
      return "#11C56D";
    case "water_regulation":
      return "#98F6C8";
  }
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
      <div className="tw-grid lg:tw-grid-cols-2">
        <div className="tw-p-10">
          <ModalBarColoredChart
            data={impacts.map(({ actors, name }) => ({
              label: getSocioEconomicImpactLabel(name),
              color: getChartColor(name),
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
        </div>

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
      </div>
    </ModalBody>
  );
};

export default SocioEconomicSubSectionDescription;
