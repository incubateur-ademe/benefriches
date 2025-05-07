import { useContext } from "react";

import {
  CO2BenefitDetails,
  getEnvironmentalProjectImpacts,
} from "@/features/projects/domain/projectImpactsEnvironmental";
import { formatCO2Impact } from "@/features/projects/views/shared/formatImpactValue";

import { getEnvironmentalDetailsImpactLabel } from "../../../getImpactLabel";
import ImpactItemDetails from "../../../list-view/ImpactItemDetails";
import ImpactItemGroup from "../../../list-view/ImpactItemGroup";
import { ModalDataProps } from "../../ImpactModalDescription";
import { ImpactModalDescriptionContext } from "../../ImpactModalDescriptionContext";
import ModalBarColoredChart from "../../shared/ModalBarColoredChart";
import ModalBody from "../../shared/ModalBody";
import ModalContent from "../../shared/ModalContent";
import ModalData from "../../shared/ModalData";
import ModalGrid from "../../shared/ModalGrid";
import ModalHeader from "../../shared/ModalHeader";
import { co2BreadcrumbSection, mainBreadcrumbSection } from "../breadcrumbSections";

type Props = {
  impactsData: ModalDataProps["impactsData"];
};

const getChartColor = (impactName: CO2BenefitDetails) => {
  switch (impactName) {
    case "avoided_co2_eq_emissions_with_production":
      return "#149FEA";
    case "avoided_air_conditioning_co2_eq_emissions":
      return "#14C3EA";
    case "avoided_car_traffic_co2_eq_emissions":
      return "#14EA81";
    case "stored_co2_eq":
      return "#E6EA14";
  }
};

const Co2BenefitDescription = ({ impactsData }: Props) => {
  const environmentalImpacts = getEnvironmentalProjectImpacts(impactsData);

  const co2Benefit = environmentalImpacts.find(({ name }) => "co2_benefit" === name);

  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const total = co2Benefit?.impact.difference ?? 0;
  const details = co2Benefit?.impact.details ?? [];

  return (
    <ModalBody size="large">
      <ModalHeader
        title="☁️ CO2-eq stocké ou évité"
        value={{
          text: formatCO2Impact(total),
          state: total > 0 ? "success" : "error",
        }}
        breadcrumbSegments={[
          mainBreadcrumbSection,
          co2BreadcrumbSection,
          { label: "CO2-eq stocké ou évité" },
        ]}
      />
      <ModalGrid>
        <ModalData>
          <ModalBarColoredChart
            formatFn={formatCO2Impact}
            data={details.map(({ impact, name }) => ({
              label: getEnvironmentalDetailsImpactLabel("co2_benefit", name),
              color: getChartColor(name as CO2BenefitDetails),
              value: impact.difference,
            }))}
          />

          {details.map(({ impact, name }) => (
            <ImpactItemGroup isClickable key={name}>
              <ImpactItemDetails
                value={impact.difference}
                label={getEnvironmentalDetailsImpactLabel("co2_benefit", name)}
                type="co2"
                labelProps={{
                  onClick: (e) => {
                    e.stopPropagation();
                    updateModalContent({
                      sectionName: "environmental",
                      impactName: "co2_benefit",
                      impactDetailsName: name,
                    });
                  },
                }}
              />
            </ImpactItemGroup>
          ))}
        </ModalData>

        <ModalContent>
          La réalisation du projet a des conséquences sur les émissions de CO2 pour plusieurs
          raisons, le cas échéant du fait :
          <ul>
            <li>
              du changement d’affectation des sols (ces derniers ayant une pouvoir de stockage de
              carbone variable selon leur type), par exemple via la désimperméabilisation puis
              renaturation,
            </li>
            <li>
              de la réduction des déplacements, par exemple par la création de fonctions urbaines en
              cœur de ville et non en périphérie,
            </li>
            <li>de la création de capacités de production d’énergies renouvelables,</li>
            <li>
              de la création d’îlot de fraîcheur urbaine, réduisant ainsi les besoin en
              rafraîchissement et/ou climatisation,
            </li>
            <li>
              de la réhabilitation de bâtiment, évitant ainsi la production de produits de
              construction.
            </li>
          </ul>
          <p>
            Des émissions sont toutefois associées à la création du projet (aménagement,
            construction neuve) pouvant de fait réduire l’ampleur des émissions évitées..
          </p>
        </ModalContent>
      </ModalGrid>
    </ModalBody>
  );
};

export default Co2BenefitDescription;
